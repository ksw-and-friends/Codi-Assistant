import React, { useState } from 'react';
import FormInput from './FormInput';
import authService from '../api/axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsLogin }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authService.login(userId, password);
            if (response.status === 200) {
                localStorage.setItem('userid', response.user.userId);
                alert('로그인에 성공하였습니다.');
                navigate('/chatroom');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 401) {
                alert('잘못된 아이디 또는 비밀번호입니다.');
            } else {
                alert('로그인에 실패하였습니다.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>로그인</h1>
            <FormInput label="아이디" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <FormInput
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
                <button type="submit">로그인</button>
                <button type="button" onClick={() => navigate('/signup')}>
                    회원가입
                </button>
            </div>
        </form>
    );
};

export default LoginForm;
