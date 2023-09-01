import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

const Navbar = () => {

    const { logout } = useLogout()
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const handleClick = () => {
        logout()
        // navigate to login page on logout from any page
        navigate("/login")
    }

    const logoutIcon = <FontAwesomeIcon icon={faRightFromBracket} />

    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>ONLINE POST MANAGER</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button
                                onClick={handleClick}
                            >
                                {logoutIcon} Log Out</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;