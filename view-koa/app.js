const Koa = require('koa'); // 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示
const router = require('koa-router')(); // 注意require('koa-router')返回的是函数
const bodyParser = require('koa-bodyparser'); // 导入request.body解析器模块
const fs = require('fs'); // 先导入fs模块，然后用readdirSync列出文件
const app = new Koa(); // 创建一个Koa对象表示web app本身
const templating = require('./templating'); // 集成给ctx对象绑定render(view, model)方法的middleware
const isProduction = process.env.NODE_ENV === 'production'; // 判断环境变量，开发环境下为false，生产环境下为true

// koa middleware #1 - 记录URL及页面执行时间:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`); // 打印URL
    var start = new Date().getTime(),
        execTime;
    await next(); // 调用下一个middleware
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// koa middleware #2 - 在开发环境下处理静态文件:
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// koa middleware #3 - 解析POST请求:
app.use(bodyParser());

// koa middleware #4 - 将render方法加到ctx上来使用Nunjucks，在开发环境下关闭缓存，以便通过刷新浏览器即可看到不同的view
app.use(templating('view', {
    noCache: !isProduction,
    watch: !isProduction
}));

function addMapping (router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"POST xxx":
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers (router) {
    var files = fs.readdirSync(__dirname + '/controllers'); // 这里可以用sync是因为启动时只运行一次，不存在性能问题
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    }, files); // 过滤出.js文件:

    // 处理每个js文件:
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/controllers/' + f); // 导入js文件
        addMapping(router, mapping); // 为js文件注册每个URL
    }
}

addControllers(router); // 添加controllers

// koa middleware #5 - 处理URL路由:
app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');