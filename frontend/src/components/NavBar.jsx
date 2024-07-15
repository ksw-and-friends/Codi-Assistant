import { Link } from 'react-router-dom'
import style from '../styles/NavBar.module.css'

export default function NavBar({ isLogin, setIsLogin }) {
    const handelLogout = () => {
        localStorage.removeItem('userid')
        window.location.reload()
        setIsLogin(false);
    }
    return (
        <div className={style.NavBar}>
            {
                isLogin === true ?
                    <div>
                        <button onClick={() => handelLogout()} className={style.Logout}>로그아웃</button>
                    </div> :
                    <div className={style.isNotLogin}>
                        <Link to="/login" className={style.Link}>로그인</Link>
                        <Link to="/signup" className={style.Link}>회원가입</Link>
                    </div>
            }
        </div>
    )
}