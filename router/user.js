const express = require('express')
const connection = require("../mysqlfiles/index")
const router = express.Router();
const datafn = require("../utils/datefn")
// 模糊搜索和分页查询用户
router.get('/', (req, res) => {
  const { keys = '', page = 1, pageSize = 10 } = req.query;

  // 计算偏移量 (offset) 和分页大小
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  const limit = parseInt(pageSize);

  // 使用 SQL 的 LIKE 进行模糊查询，并限制结果数和偏移量
  const query = `
    SELECT * FROM userTable
    WHERE user_name LIKE ?
    LIMIT ? OFFSET ?
  `;
  const searchParam = `%${keys}%`;

  connection.query(query, [searchParam, limit, offset], (error, results) => {
    if (error) {
      res.status(500).send('数据库查询失败');
      console.error('查询错误:', error.stack);
      return;
    }
    results.forEach(item=>{
        item.created_at = datafn.formatDate(item.created_at)
    })
    // 获取总条目数，用于计算总页数
    connection.query('SELECT COUNT(*) AS total FROM userTable WHERE user_name LIKE ?', [searchParam], (countError, countResults) => {
      if (countError) {
        res.status(500).send('获取总条目数失败');
        console.error('统计错误:', countError.stack);
        return;
      }

      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);

      // 返回分页数据
      res.json({
        data: results,
        currentPage: parseInt(page),
        pageSize: limit,
        totalItems: total,
        totalPages: totalPages,
        code: 1000,
        msg:''
      });
    });
  });
});

router.delete('/:id',(req,res)=>{
   const qurey = `DELETE from userTable  where  id = ?`
   console.log(req.query,req.body,'delete',req.params);
   let { id } = req.params
   connection.query(qurey,[id],(error,results)=>{
      if (error) {
        return res.send({
            code:1404,
            msg: error
        })
      }
      console.log('删除成功',results)
      res.send({
        code:1000,
        msg:'操作成功'
      })
   })
})

router.post('/add',(req,res)=>{
    let sql = `INSERT INTO userTable (user_name,age,avatar) values (?,?,?)`
    let {user_name, age, avatar} = req.body
    connection.query(sql,[user_name,age,avatar],(error,results)=>{
       if (error) {
        console.log(error);
         return res.send({
            code: 1004,
            msg:'插入失败,参数错误'
          })
       }
       res.send({
        code:1000,
        msg:'创建成功'
       })
    })
})


router.put('/edit/:id',(req,res)=>{
    let sql = `UPDATE userTable set user_name = ?,age = ?, avatar= ? where id = ?`
    let {user_name, age, avatar} = req.body
    let { id } = req.params
    connection.query(sql,[user_name,age,avatar, id],(error,results)=>{
       if (error) {
        console.log(error);
         return res.send({
            code: 1004,
            msg:'修改失败,参数错误'
          })
       }
       res.send({
        code:1000,
        msg:'修改成功'
       })
    })
})
module.exports = router