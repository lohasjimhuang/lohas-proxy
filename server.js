const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/login', async (req, res) => {
    try {
        const response = await fetch('https://lohastest.realtime.tw/webapi/v010/officialWed/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('代理伺服器錯誤:', error);
        res.status(500).json({ code: "500", message: "中繼伺服器轉發失敗" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
