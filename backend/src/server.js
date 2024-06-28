// 仮で、3000板でサーバーを立てる

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
