import { useState, useEffect } from "react";
import axios from "axios";
import style from '../../styles/Chat.module.css';
import NavBar from "../../components/NavBar";

const Chat = ({ isLogin, setIsLogin }) => {
    const [text, setText] = useState('');
    const [modal, setModal] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const userId = localStorage.getItem('userid');

    useEffect(() => {
        if (userId) {
            setIsLogin(true);
            fetchChatRooms();
        }
    }, [userId]);

    useEffect(() => {
        if (selectedRoom) {
            fetchMessages(selectedRoom);
        }
    }, [selectedRoom]);

    const fetchChatRooms = async () => {
        try {
            const response = await axios.get(`http://localhost:3030/api/chat-rooms/${userId}`);
            setChatRooms(response.data.data);
        } catch (error) {
            console.error("Error fetching chat rooms:", error);
        }
    };

    const createChatRoom = async () => {
        try {
            await axios.post('http://localhost:3030/api/chat-room', {
                user_id: userId,
                title: newRoomTitle
            });
            setNewRoomTitle('');
            setModal(false);
            fetchChatRooms();
        } catch (error) {
            console.error("Error creating chat room:", error);
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const response = await axios.get(`http://localhost:3030/api/chat-room-messages/${roomId}`);
            setMessages(response.data.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!selectedRoom || isNaN(selectedRoom)) {
            console.error("Invalid chatRoomId");
            return;
        }

        if (!newMessage.trim()) {
            console.error("Message content is empty");
            return;
        }

        try {
            // 메시지 전송
            const response = await axios.post('http://localhost:3030/api/chat-message', {
                chatRoomId: parseInt(selectedRoom, 10),
                user_id: userId,
                content: newMessage
            });

            // 서버로부터 받은 메시지를 추가
            setMessages((prevMessages) => [...prevMessages, {
                user_id: userId,
                content: newMessage,
                role: 'user'
            }]);

            // ChatGPT API 호출
            const gptResponse = await axios.post(`http://localhost:3030/api/codi-results/${userId}`, {
                content: newMessage
            });

            // ChatGPT 응답 메시지 추가
            if (gptResponse.data.data) {
                setMessages((prevMessages) => [...prevMessages, {
                    user_id: 'GPT-3',
                    content: gptResponse.data.data.recommendations,
                    role: 'assistant'
                }]);
            }

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className={style.Chat_component}>
            <div style={{
                width: '100%',
                height: '100vh',
                zIndex: `${modal === true ? "50" : "-100"}`,
                position: "absolute",
                backgroundColor: "rgba(255,255,192,0.1)",
                backdropFilter: "blur(2px)",
                boxShadow: "2px 7px 15px 8px rgba(0,0,0,0.3)",
            }}></div>
            <NavBar isLogin={isLogin} setIsLogin={setIsLogin} />
            <div className={style.sideBar}>
                <div className={style.create_room_button}>
                    <button onClick={() => {
                        setModal(true);
                    }}>새 채팅방 만들기</button>
                </div>
                <div>
                    {chatRooms.map((room) => (
                        <div key={room.id} className={style.chatroom} onClick={() => setSelectedRoom(parseInt(room.id, 10))}>
                            <h3>{room.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.chating_container}>
                <div className={style.chating_component}>
                    <div className={style.Chat_list}>
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.role === 'user' ? style.own_message : style.other_message}>
                                <div className={style.message_container}>
                                    <div className={style.message_user}>{msg.role === 'user' ? '나' : 'GPT-3'}</div>
                                    <div className={style.message_content}>{msg.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={style.Chat_input}>
                    <input
                        type="text"
                        placeholder="입력해주세요..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <input type="submit" value={"전송"} onClick={sendMessage} />
                </div>
            </div>
            {
                modal === true ?
                    <div className={style.modal_component}>
                        <div className={style.close_button}>
                            <button onClick={() => {
                                setModal(false);
                            }}>닫기</button>
                        </div>
                        <div className={style.create_input_box}>
                            <label
                                style={{
                                    position: "absolute",
                                    top: `${mouseOver === true ? "-25%" : "12%"}`,
                                    left: "2%",
                                    transition: "all 0.3s",
                                    fontSize: "13px",
                                }}
                                htmlFor="title"
                            >
                                {mouseOver === true ? "제목" : "제목을 입력해주세요."}
                            </label>
                            <input
                                id="title"
                                type="text"
                                className={style.title_input}
                                onChange={(e) => {
                                    setNewRoomTitle(e.target.value);
                                }}
                                onFocus={() => {
                                    setMouseOver(true);
                                }}
                                onBlur={() => {
                                    if (newRoomTitle === "") {
                                        setMouseOver(false);
                                    } else {
                                        setMouseOver(true);
                                    }
                                }}
                                value={newRoomTitle}
                            />
                            <input type="submit" className={style.submit} value={"생성 하기"} onClick={createChatRoom} />
                        </div>
                    </div> :
                    ""
            }
        </div>
    );
}

export default Chat;
