import React, { useState } from 'react';
import FormInput from './FormInput';
import authService from '../api/axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginForm.module.css';
import Logo from '../img/w.png';

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
            <div className={styles.text}>
                <p className={styles.mainTitle}>
                    Welcome to <b>ksw-and-friends</b>
                </p>
                <p className={styles.middleTitle}>Login to access your account</p>
            </div>
            <div className={styles.body}>
                <img className={styles.logo} src={Logo} alt="Logo" />
                <h1 className={styles.title}>Login</h1>
                <div className={styles.inputBox}>
                    <div className={styles.idInputBox}>
                        <p>아이디</p>
                        <FormInput type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div className={styles.idInputBox}>
                        <p>비밀번호</p>
                        <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className={styles.buttonBox}>
                    <button className={styles.button} type="submit">
                        로그인
                    </button>
                </div>
                <div className={styles.aButtonBox}>
                    <button className={styles.aButton} type="button" onClick={() => navigate('/signup')}>
                        계정이 없으신가요?
                    </button>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
