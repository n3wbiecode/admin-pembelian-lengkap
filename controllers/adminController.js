const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const db = require('../config/db');

exports.dashboard = (req, res) => {
  Product.all((err, products) => {
    if (err) {
      console.error(err);
      return res.render('admin/dashboard', { products: [] });
    }

    res.render('admin/dashboard', { products });
  });
};

exports.buy = (req, res) => {
  const { product_id, quantity } = req.body;

  db.query(
    'SELECT price FROM products WHERE id=?',
    [product_id],
    (err, result) => {
      if (err) return res.redirect('/dashboard');

      const total = result[0].price * quantity;

      db.query(
        'INSERT INTO purchases (product_id, quantity, total_price) VALUES (?,?,?)',
        [product_id, quantity, total]
      );

      db.query(
        'UPDATE stock SET quantity = quantity - ? WHERE product_id=?',
        [quantity, product_id]
      );

      res.redirect('/dashboard');
    }
  );
};

exports.purchases = (req, res) => {
  Purchase.all((err, purchases) => {
    if (err) {
      console.error(err);
      return res.render('admin/purchases', { purchases: [] });
    }

    res.render('admin/purchases', { purchases });
  });
};

exports.cancel = (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT * FROM purchases WHERE id=?',
    [id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.redirect('/purchases');
      }

      const purchase = result[0];

      if (purchase.status === 'ACTIVE') {
        db.query(
          'UPDATE purchases SET status="CANCELED" WHERE id=?',
          [id]
        );

        db.query(
          'UPDATE stock SET quantity = quantity + ? WHERE product_id=?',
          [purchase.quantity, purchase.product_id]
        );
      }

      res.redirect('/purchases');
    }
  );
};
