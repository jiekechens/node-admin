const express = require("express")
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors')
const bodyParser = require('body-parser');
//const  as  =require('multer')
const userRouters = require('./router/user');
const port = 3339


if (cluster.isPrimary) {
  console.log(`主進程 PID: ${process.pid}  cup ${numCPUs}`);

  // 建立工作進程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 監聽工作進程退出事件，並重新創建新的工作進程
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作進程 ${worker.process.pid} 退出，重啟中...`);
    cluster.fork();
  });
} else {
  // 單個工作進程的伺服器邏輯
  const app = express()
app.use(cors())
app.use(bodyParser.json());  // 用于解析 JSON 格式的请求体
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user',userRouters)

  // 設定路由和中間件
  app.get('/', (req, res) => {
    res.send(`Hello from the worker process! PID: ${process.pid}`);
  });

  // 啟動工作進程的伺服器
  app.listen(port, () => {
    console.log(`${port} 工作進程 ${process.pid} 開始運行-- ${cluster.isPrimary}`);
  });
}