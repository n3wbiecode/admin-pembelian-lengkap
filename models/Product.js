const db = require('../config/db');
exports.all = cb => {
 db.query(`SELECT p.*, s.quantity FROM products p JOIN stock s ON p.id=s.product_id`, cb);
};