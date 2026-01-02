const db = require('../config/db');
exports.login = (u,p,cb)=>{
 db.query('SELECT * FROM admin WHERE username=? AND password=?',[u,p],cb);
};