const User = require('../models/user.js');

module.exports.signup = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.newUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        //directly login after registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'welcome to wanderland !');
            res.redirect('/listings');
        })

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
}

module.exports.login = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.auth = async (req, res) => {
    req.flash('success', 'login successful ! welcome to wanderland');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash('success', 'user logged out !');
        res.redirect('/listings');
    })
}