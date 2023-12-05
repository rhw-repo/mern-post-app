import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import styles from "./Navbar.module.css";

const Navbar = () => {

    const { logout, logoutError } = useLogout()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        // navigate to login page on logout from any page
        navigate("/login")
    }

    const logoutIcon = <FontAwesomeIcon icon={faRightFromBracket} />

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.link}>
                    <h1>ONLINE POST MANAGER</h1>
                </Link>
                <nav className={styles.nav}>
                    {user && (
                        <>
                            <span className={styles.userEmail}>username15chars</span>
                            <button
                                onClick={handleClick}
                                className={styles.navLogoutButton}
                            >
                                {logoutIcon} Log Out</button>
                        </>
                    )}
                </nav>
                {logoutError && <div className="error">{logoutError}</div>}
            </div>
        </header>
    )
}

export default Navbar;