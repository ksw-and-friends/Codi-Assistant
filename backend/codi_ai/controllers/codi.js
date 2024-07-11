const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();
const prisma = require('../../../../prisma');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const codiLikeClothing = async (chatRoomId, userId, inputClothing) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "당신은 패션 스타일리스트입니다. 사용자가 제시하는 의류 아이템에 어울리는 코디를 추천해야 합니다."
                },
                {
                    role: 'user',
                    content: `"${inputClothing}"와 관련된 어울리는 색깔의 옷, 바지, 모자, 신발과 코디의 브랜드 상품명을 순서대로 알려줘. 또한 각각의 상품명이 적혀있는 네이버 쇼핑 URL을 출력해줘.`
                }
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

        lines.forEach(line => {
            if (line.includes('네이버 쇼핑 URL:')) {
                urls += line.split('네이버 쇼핑 URL: ')[1] + '\n';
            } else {
                recommendations += line + '\n';
            }
        });

        recommendations = recommendations.trim();
        urls = urls.trim();

        // Save response message
        await addChatMessage(chatRoomId, userId, "assistant", codiLike);

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
        console.error('추천 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};
