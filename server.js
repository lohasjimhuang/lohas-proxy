const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 修改 server.js 以支援所有 LOHAS API 的轉發
app.post('/api/proxy/*', async (req, res) => {
    // 取得網址中 /api/proxy/ 之後的路徑
    const targetPath = req.params[0]; 
    const targetUrl = `https://lohastest.realtime.tw/webapi/v010/${targetPath}`;
    
    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy forward failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
