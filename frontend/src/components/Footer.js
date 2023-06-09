/* TODO: 
1. Navigation - add to Link conditional render 'Home' icon except homepage */
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="footer">
                <Link to="/">
                    <small>© 2023 R Westnidge Brown. All rights reserved.</small>
                </Link>
            </div>
        </footer>
    )
}

export default Footer;





