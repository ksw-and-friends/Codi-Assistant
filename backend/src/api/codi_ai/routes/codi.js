const express = require('express');
const router = express.Router();
const {
    createChatRoom,
    getChatRooms,
    addChatMessage,
    codiLikeClothing,
    getCodiResults,
    getChatRoomMessages
} = require('../controllers/codi');

router.post('/chat-room', async (req, res) => {
    const { user_id, title } = req.body;
    try {
        const chatRoom = await createChatRoom(user_id, title);
        res.status(200).json({ status: 200, data: chatRoom });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
});

router.get('/chat-rooms/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const chatRooms = await getChatRooms(userId);
        res.status(200).json({ status: 200, data: chatRooms });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
});

router.post('/chat-message', async (req, res) => {
    const { chatRoomId, user_id, content } = req.body;
    try {
        const chatRoomIdInt = parseInt(chatRoomId, 10);

        if (isNaN(chatRoomIdInt)) {
            throw new Error('Invalid chatRoomId, must be an integer.');
        }

        const chatRoom = await prisma.ChatRoom.findUnique({
            where: { id: chatRoomIdInt },
        });

        if (!chatRoom) {
            throw new Error('Chat room not found.');
        }

        await addChatMessage(chatRoomIdInt, user_id, 'user', content);

        const result = await codiLikeClothing(chatRoomIdInt, user_id, content);
        res.status(200).json({
            status: 200,
            data: {
                id: result.id,
                user_id: result.user_id,
                recommendations: result.codi_res,
                urls: result.codi_res_url,
                createdat: result.createdat,
                updatedat: result.updatedat,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
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
            data: results.map((result) => ({
                id: result.id,
                user_id: result.user_id,
                recommendations: result.codi_res,
                urls: result.codi_res_url,
                createdat: result.createdat,
                updatedat: result.updatedat,
            })),
        });
    } catch (error) {
        console.error('오류 발생:', error);
        res.status(500).json({ status: 500, error: '결과를 가져오는 중에 오류가 발생했습니다.' });
    }
});

router.get('/chat-room-messages/:chatRoomId', async (req, res) => {
    const { chatRoomId } = req.params;
    try {
        const chatRoom = await getChatRoomMessages(chatRoomId);
        res.status(200).json({
            status: 200,
            data: chatRoom.messages,
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
});

module.exports = router;
