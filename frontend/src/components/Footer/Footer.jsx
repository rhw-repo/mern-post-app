import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={styles.footer}>
        <span>© 2023 R Westnidge Brown.</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
