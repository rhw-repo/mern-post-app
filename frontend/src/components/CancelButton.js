// user needs a way to abandon action & return to homepage
import { useNavigate } from "react-router-dom";

const CancelButton = () => {
    const navigate = useNavigate()

const cancel = () => {
    navigate("/")
  }

  return (
    <button className="cancel_btn" onClick={cancel}>Cancel</button>
  )
}

export default CancelButton;