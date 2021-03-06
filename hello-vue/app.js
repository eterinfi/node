const Koa = require('koa');
const app = new Koa();
const isProduction = process.env.NODE_ENV === 'production';

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); 
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${ms}ms`);
});

let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

app.use(async (ctx, next) => {
    ctx.response.redirect('/static/index.html');
});

app.listen(3000);
console.log('app started at port 3000...');