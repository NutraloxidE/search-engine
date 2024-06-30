const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

app.prepare().then(() => {
  // カスタムエンドポイントの設定
  server.get('/api/test', (req, res) => {
    res.send('test');
  });

  // Next.jsのハンドラを使用して残りのリクエストを処理
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});