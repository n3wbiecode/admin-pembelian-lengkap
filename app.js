const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'adminsecret',
  resave: false,
  saveUninitialized: true
}));

// 🔑 WAJIB: DEFAULT VARIABEL LAYOUT
app.use((req, res, next) => {
  res.locals.isLoginPage = false;
  next();
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
``
