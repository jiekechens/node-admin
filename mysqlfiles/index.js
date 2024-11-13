const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // 数据库主机地址
  user: 'root', // 数据库用户名
  password: 'root123456', // 数据库密码
  database: 'node-admin' // 要连接的数据库
});

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('成功连接到数据库');
});
module.exports = connection
