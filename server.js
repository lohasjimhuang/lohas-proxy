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
app.post('/api/proxy/*', async (req, res) => {
    const targetPath = req.params[0]; 
    const targetUrl = `https://lohastest.realtime.tw/webapi/v010/${targetPath}`;
    
    console.log(`[Proxy] → ${targetUrl}`);
    console.log(`[Proxy] body:`, JSON.stringify(req.body));

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        // 讀回 raw text，再嘗試當 JSON 解析
        const rawText = await response.text();
        console.log(`[Proxy] ← status ${response.status}, body:`, rawText.slice(0, 300));

        // 把上游狀態碼也帶回前端
        res.status(response.status);

        try {
            const data = JSON.parse(rawText);
            res.json(data);
        } catch {
            // 上游回的不是 JSON（可能是 HTML 錯誤頁）
            res.json({ 
                error: 'Upstream returned non-JSON',
                upstreamStatus: response.status,
                body: rawText.slice(0, 500)
            });
        }
    } catch (error) {
        console.error('[Proxy] forward error:', error);
        res.status(500).json({ 
            error: 'Proxy forward failed',
            detail: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
