// user needs a way to abandon action & return to homepage
import { useNavigate } from "react-router-dom";
import styles from "./CancelButton.module.css";

const CancelButton = () => {
  const navigate = useNavigate()

  const cancel = () => {
    navigate("/")
  }

  return (
    <button className={`${styles.cancelBtn} cancel-btn`} onClick={cancel}>Cancel</button>
  )
}

export default CancelButton;