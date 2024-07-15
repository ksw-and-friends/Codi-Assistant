const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const prisma = require('../../../../prisma');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const createChatRoom = async (userId, title) => {
    try {
        const user = await prisma.User.findUnique({
            where: { user_id: userId },
        });

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        const chatRoom = await prisma.ChatRoom.create({
            data: {
                user_id: userId,
                title: title,
            },
        });

        return chatRoom;
    } catch (error) {
        console.error('채팅방 생성 중 오류 발생:', error.message);
        throw error;
    }
};

const addChatMessage = async (chatRoomId, userId, role, content) => {
    try {
        const chatMessage = await prisma.ChatMessage.create({
            data: {
                chatroom_id: chatRoomId,
                user_id: userId,
                role: role,
                content: content,
            },
        });
        return chatMessage;
    } catch (error) {
        console.error('메시지 추가 중 오류 발생:', error.message);
        throw error;
    }
};

const getChatRooms = async (userId) => {
    try {
        const chatRooms = await prisma.ChatRoom.findMany({
            where: { user_id: userId },
            include: { messages: true },
        });
        return chatRooms;
    } catch (error) {
        console.error('채팅방 목록 가져오기 중 오류 발생:', error.message);
        throw error;
    }
};

const getChatRoomMessages = async (chatRoomId) => {
    try {
        const chatRoomIdInt = parseInt(chatRoomId, 10);

        const chatRoom = await prisma.ChatRoom.findUnique({
            where: {
                id: chatRoomIdInt,
            },
            include: {
                messages: true,
            },
        });

        if (!chatRoom) {
            throw new Error('채팅방을 찾을 수 없습니다.');
        }

        return chatRoom;
    } catch (error) {
        console.error('채팅방 메시지 가져오기 중 오류 발생:', error.message);
        throw error;
    }
};

const codiLikeClothing = async (chatRoomId, userId, inputClothing) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "당신은 패션 스타일리스트입니다. 사용자가 제시하는 의류 아이템에 어울리는 코디를 추천해야 합니다.",
                },
                {
                    role: 'user',
                    content: `"${inputClothing}"와 관련된 어울리는 색깔의 옷, 바지, 모자, 신발과 코디의 브랜드 상품명을 순서대로 알려줘. 또한 각각의 상품명이 적혀있는 네이버 쇼핑 URL을 출력해줘.`,
                },
            ],
            max_tokens: 2000,
            temperature: 0,
        });

        const codiLike = response.choices[0].message.content.trim();
        if (!codiLike) {
            throw new Error('응답에서 추천 정보를 찾을 수 없습니다.');
        }

        const lines = codiLike.split('\n');
        let recommendations = '';
        let urls = '';

        lines.forEach((line) => {
            if (line.includes('네이버 쇼핑 URL:')) {
                urls += line.split('네이버 쇼핑 URL: ')[1] + '\n';
            } else {
                recommendations += line + '\n';
            }
        });

        recommendations = recommendations.trim();
        urls = urls.trim();

        if (chatRoomId !== null) {
            await addChatMessage(chatRoomId, userId, 'assistant', codiLike);
        }

        const savedResult = await prisma.Codi_Result.create({
            data: {
                user_id: userId,
                codi_res: recommendations,
                codi_res_url: urls,
                updatedat: new Date(),
            },
        });

        return savedResult;
    } catch (error) {
        console.error('추천 정보를 가져오는 중 오류 발생:', error.message);

        // 기본 응답 제공
        const defaultResponse = {
            codi_res: "죄송합니다. 현재 서버에 문제가 있어 추천 정보를 제공할 수 없습니다.",
            codi_res_url: ""
        };

        return defaultResponse;
    }
};

const getCodiResults = async (userId) => {
    try {
        const results = await prisma.Codi_Result.findMany({
            where: { user_id: userId },
        });
        return results;
    } catch (error) {
        console.error('코디 결과 가져오기 중 오류 발생:', error.message);
        throw error;
    }
};

module.exports = {
    createChatRoom,
    getChatRooms,
    addChatMessage,
    codiLikeClothing,
    getCodiResults,
    getChatRoomMessages
};
