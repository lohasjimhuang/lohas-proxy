const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// 健康檢查用：打根路徑會看到 OK，方便確認服務活著
app.get('/', (req, res) => {
    res.send('LOHAS Proxy is running. Use POST /api/proxy/<path>');
});

// 轉發所有 LOHAS API
// server.js 裡面轉發的部分
app.post('/api/proxy/*', async (req, res) => {
    const targetPath = req.params[0]; 
    const targetUrl = `https://lohastest.realtime.tw/webapi/v010/${targetPath}`;
    
    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' // 這行絕對不能少
            },
            body: JSON.stringify(req.body) // 直接把前端傳來的 Body 轉字串轉發
        });
        
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: '連線失敗' });
    }
});
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
