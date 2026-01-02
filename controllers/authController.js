const Admin = require('../models/Admin');

exports.loginView = (req, res) => {
  res.locals.isLoginPage = true;
  res.render('admin/login', { error: null });
};


exports.login = (req, res) => {
  const { username, password } = req.body;

  Admin.login(username, password, (err, result) => {
    if (err) {
      console.error(err);
      return res.render('admin/login', { error: 'Error server' });
    }

    if (result.length > 0) {
      req.session.admin = true;
      res.redirect('/dashboard');
    } else {
      res.render('admin/login', { error: 'Username / password salah' });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
