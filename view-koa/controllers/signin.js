var fn_signin = async (ctx, next) => {
    var email = ctx.request.body.email || '',
        password = ctx.request.body.password || '';
    if (email === 'admin@example.com' && password === '123456') {
        // Signin successful
        ctx.render('signin-ok.html', { title: 'Sign In OK', name: 'Mr Node' });
    } else {
        // Signin failed
        ctx.render('signin-failed.html', { title: 'Sign In Failed' });
    }
}

module.exports = { 'POST /signin': fn_signin }