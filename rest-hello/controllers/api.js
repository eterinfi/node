// 存储Products列表，相当于模拟数据库:
var products = [{
    name: 'iPhone',
    price: 6999
}, {
    name: 'Kindle',
    price: 999
}];

module.exports = {
    'GET /api/products':async(ctx,next)=>{
        // 设置返回的Content-Type:
        ctx.response.type='application/json';
        // 设置返回的主体内容:
        ctx.response.body={
            products: products
        };
    },
    'POST /api/products':async(ctx,next)=>{
        var p={
            name:ctx.request.body.name,
            price:ctx.request.body.price
        };
        products.push(p);
        // 设置Content-Type:
        ctx.response.type='application/json';
        // 设置返回的主体内容:
        ctx.response.body=p;
    }
};