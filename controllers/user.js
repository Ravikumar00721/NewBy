
const User = require('../models/user');

module.exports.register=async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            console.log(registerUser);
            req.flash('success', 'Welcome Bro');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.reForm= (req, res) => {
    res.render('user/register');
}
module.exports.logForm= (req, res) => {
    res.render('user/login');
}
module.exports.log= (req, res) => {
    req.flash('success', 'Welcome');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logout= (req, res, next) => {
    req.logout()//if you use newer version then use callback function inside o/w dont give call back function in older version
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}