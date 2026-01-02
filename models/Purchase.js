const db = require('../config/db');
exports.all = cb => {
 db.query(`SELECT pu.*, p.name FROM purchases pu JOIN products p ON pu.product_id=p.id`, cb);
};