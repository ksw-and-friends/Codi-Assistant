import React, { useState } from 'react';
import FormInput from './FormInput';
import authService from '../api/axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignupForm.module.css';
import Logo from '../img/w.png';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.signup(name, userId, password);
            if (response.status === 200) {
                alert('회원가입에 성공하였습니다.');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert('회원가입에 실패하였습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.text}>
                <p className={styles.mainTitle}>
                    Welcome to <b>ksw-and-friends</b>
                </p>
                <p className={styles.middleTitle}>Create your account</p>
            </div>
            <form className={styles.body} onSubmit={handleSubmit}>
                <img className={styles.logo} src={Logo} alt="Logo" />
                <h1 className={styles.title}>Register</h1>
                <div className={styles.inputBox}>
                    <div className={styles.idInputBox}>
                        <p>이름</p>
                        <FormInput type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={styles.idInputBox}>
                        <p>아이디</p>
                        <FormInput type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    </div>
                    <div className={styles.idInputBox}>
                        <p>비밀번호</p>
                        <FormInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <button className={styles.button} type="submit">
                    회원가입
                </button>
                <button className={styles.aButton} type="button" onClick={() => navigate('/login')}>
                    로그인 할 계정이 있으신가요?
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
