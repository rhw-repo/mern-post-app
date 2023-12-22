import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import styles from "./Navbar.module.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { logout, logoutError } = useLogout()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        // navigate to login page on logout from any page
        navigate("/login")
    }
    const logoutIcon = <FontAwesomeIcon icon={faRightFromBracket} className={styles.navLogoutIcon} />

    return (
        <>
            <nav className={styles.navbarContainer}>
                <Link to="/" className={styles.link}>
                    <h1>ONLINE POST MANAGER</h1>
                </Link>
                {user && (
                    <div
                        className={styles.navMenu}
                        onClick={() => {
                            setMenuOpen(!menuOpen)
                        }}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <ul className={menuOpen ? styles.open : ""}>
                    {user && (
                        <>
                            <li className={styles.navList}>
                                <span className={styles.userEmail}>username15chars</span>
                            </li>
                            <li className={styles.navList}>
                                <button
                                    onClick={handleClick}
                                    className={styles.navLogoutButton}
                                >
                                    {logoutIcon} Log Out</button>
                            </li>
                        </>
                    )}
                </ul>
                {logoutError && <div className="error">{logoutError}</div>}
            </nav>
        </>
    )
}

export default Navbar;