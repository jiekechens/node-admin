const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser');
//const  as  =require('multer')
const userRouters = require('./router/user');
const port = 3339
const app = express()
app.use(cors())
app.use(bodyParser.json());  // 用于解析 JSON 格式的请求体
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user',userRouters)
app.listen(3339, () => {
    console.log(`Example app listening on port ${port}`)
})