const Koa = require('koa'); // 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示
const bodyParser = require('koa-bodyparser'); // 导入request.body解析器模块
const router = require('koa-router')(); // 注意require('koa-router')返回的是函数
const fs = require('fs'); // 先导入fs模块，然后用readdirSync列出文件
const templating = require('./templating.js');
const rest = require('./rest');
const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// 将request.body解析器注册到app上:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('view', {
    noCache: true,
    watch: true
}));

// 给ctx绑定rest方法:
app.use(rest.restify());

// 加载controllers目录下的控制器:
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
        } else if (url.startsWith('PUT ')) {
            // 如果url类似"PUT xxx":
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            // 如果url类似"DELETE xxx":
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers (router) {
    var files = fs.readdirSync(__dirname + '/controllers'); // 这里可以用sync是因为启动时只运行一次，不存在性能问题
    var js_files = files.filter((f) => {
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

// koa middleware - add router middleware:
app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');