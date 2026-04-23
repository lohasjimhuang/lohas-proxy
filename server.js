const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('LOHAS Proxy Active'));

// 核心轉發邏輯
app.post('/api/proxy/*', async (req, res) => {
    const targetPath = req.params[0]; 
    // 自動組合成測試站完整路徑
    const targetUrl = `https://lohas.realtime.tw/webapi/v010/${targetPath}`;
    
    console.log(`[Proxy Request] → ${targetUrl}`);
    console.log(`[Body Payload]`, JSON.stringify(req.body));

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        console.log(`[Proxy Response] ← Status: ${response.status}`, data);
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('[Proxy Error]', error.message);
        res.status(500).json({ error: '連線至 LOHAS 伺服器失敗' });
    }
});

app.listen(PORT, () => console.log(`Proxy on port ${PORT}`));
