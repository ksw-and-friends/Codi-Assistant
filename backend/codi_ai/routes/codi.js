const express = require('express');
const router = express.Router();
const { codiLikeClothing, getCodiResults } = require('../controllers/codi');

router.post('/codi', async (req, res) => {
    const { user_id, clothing } = req.body;
    try {
        const result = await codiLikeClothing(user_id, clothing);
        res.status(200).json({
            status: 200,
            data: {
                id: result.id,
                user_id: result.user_id,
                recommendations: result.codi_res,
                urls: result.codi_res_url,
                createdat: result.createdat,
                updatedat: result.updatedat
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

router.get('/codi-results/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const results = await getCodiResults(userId);
        if (results.length === 0) {
            return res.status(404).json({ status: 404, message: '해당 사용자의 결과를 찾을 수 없습니다.' });
        }
        res.status(200).json({
            status: 200,
            data: results.map(result => ({
                id: result.id,
                user_id: result.user_id,
                recommendations: result.codi_res,
                urls: result.codi_res_url,
                createdat: result.createdat,
                updatedat: result.updatedat
            }))
        });
    } catch (error) {
        console.error('오류 발생:', error);
        res.status(500).json({ status: 500, error: '결과를 가져오는 중에 오류가 발생했습니다.' });
    }
});

module.exports = router;
