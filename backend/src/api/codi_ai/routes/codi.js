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
const prisma = require('../../../../prisma');

router.post('/chat-room', async (req, res) => {
    const { user_id, title } = req.body;
    try {
        const chatRoom = await createChatRoom(user_id, title);
        res.status(200).json({ status: 200, data: chatRoom });
    } catch (error) {
        console.error('채팅방 생성 중 오류 발생:', error);
        res.status(500).json({ status: 500, message: '채팅방 생성 중 오류가 발생했습니다.' });
    }
});

router.get('/chat-rooms/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const chatRooms = await getChatRooms(userId);
        res.status(200).json({ status: 200, data: chatRooms });
    } catch (error) {
        console.error('채팅방 목록 조회 중 오류 발생:', error);
        res.status(500).json({ status: 500, message: '채팅방 목록을 가져오는 중 오류가 발생했습니다.' });
    }
});

router.post('/chat-message', async (req, res) => {
    const { chatRoomId, user_id, content } = req.body;
    try {
        const chatRoomIdInt = parseInt(chatRoomId, 10);
        if (isNaN(chatRoomIdInt)) {
            throw new Error('유효하지 않은 채팅방 ID입니다. 정수여야 합니다.');
        }
        const chatRoom = await prisma.ChatRoom.findUnique({
            where: { id: chatRoomIdInt },
        });
        if (!chatRoom) {
            throw new Error('채팅방을 찾을 수 없습니다.');
        }
        const chatMessage = await addChatMessage(chatRoomIdInt, user_id, 'user', content);
        const result = await codiLikeClothing(chatRoomIdInt, user_id, content);
        res.status(200).json({
            status: 200,
            data: {
                id: chatMessage.id,
                user_id: chatMessage.user_id,
                content: chatMessage.content,
                createdat: chatMessage.createdat,
                updatedat: chatMessage.updatedat,
                recommendations: result.codi_res,
                urls: result.codi_res_url,
            },
        });
    } catch (error) {
        console.error('채팅 메시지 처리 중 오류 발생:', error);
        res.status(500).json({
            status: 500,
            message: '채팅 메시지 처리 중 오류가 발생했습니다.',
        });
    }
});

router.post('/codi-results/:userId', async (req, res) => {
    const { userId } = req.params;
    const { content } = req.body;
    try {
        const result = await codiLikeClothing(null, userId, content);
        res.status(200).json({
            status: 200,
            data: {
                recommendations: result.codi_res,
                urls: result.codi_res_url,
            },
        });
    } catch (error) {
        console.error('코디 결과 생성 중 오류 발생:', error);
        res.status(500).json({
            status: 500,
            message: '코디 결과를 생성하는 중에 오류가 발생했습니다.',
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
        console.error('코디 결과 조회 중 오류 발생:', error);
        res.status(500).json({ status: 500, message: '코디 결과를 가져오는 중에 오류가 발생했습니다.' });
    }
});

router.get('/chat-room-messages/:chatRoomId', async (req, res) => {
    const { chatRoomId } = req.params;
    try {
        const chatRoomIdInt = parseInt(chatRoomId, 10);
        if (isNaN(chatRoomIdInt)) {
            return res.status(400).json({ 
                status: 400, 
                message: '유효하지 않은 채팅방 ID입니다. 정수여야 합니다.' 
            });
        }
        const chatRoom = await getChatRoomMessages(chatRoomIdInt);
        if (!chatRoom) {
            return res.status(404).json({ 
                status: 404, 
                message: '채팅방을 찾을 수 없습니다.' 
            });
        }
        res.status(200).json({
            status: 200,
            data: chatRoom.messages,
        });
    } catch (error) {
        console.error('채팅방 메시지 조회 중 오류 발생:', error);
        res.status(500).json({ status: 500, message: '채팅방 메시지를 가져오는 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
