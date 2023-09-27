import { useState } from "react"
import { useMaterialsContext } from "../hooks/useMaterialsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons"

const DeleteButton = ({ _id }) => {
    const [showDialog, setShowDialog] = useState(false)
    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleDeleteClick = () => {
        setShowDialog(true)
    }

    const handleConfirmDelete = async () => {
        setShowDialog(false)

        if (!user) {
            return;
        }

        const response = await fetch(`api/materials/${_id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (response.ok) {
            dispatch({ type: "DELETE_MATERIAL", payload: json })
            console.log("Delete succesful")
            navigate("/")
        }
    }

    const handleCancelDelete = () => {
        setShowDialog(false)
    }

    const deleteIcon = <FontAwesomeIcon icon={faTrashCan} className="dialog-button-icon" size="xl" />
    const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} className="dialog-button-icon" />

    return (
        <div className="delete-div">
            <span
                className="delete-span"
                onClick={handleDeleteClick}
            >
                {deleteIcon}
            </span>

            {showDialog && (
                <dialog open className="dialog-confirm-delete">
                    <h2 className="confirm-delete">Confirm Deletion</h2>
                    <p><strong>Do you want to delete this item?</strong></p>
                    <p>Choosing the delete button here cannot be undone.</p>
                    <div className="confirm-delete-buttons">
                        <button
                            className="yes-delete-btn"
                            onClick={handleConfirmDelete}
                        >
                            {deleteIcon} Yes, delete
                        </button>
                        <button
                            className="no-cancel-delete-btn"
                            onClick={handleCancelDelete}
                        >
                            {saveIcon} No - Keep it
                        </button>
                    </div>
                </dialog>
            )}
        </div>
    )
}

export default DeleteButton
