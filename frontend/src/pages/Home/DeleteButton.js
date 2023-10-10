import { useState } from "react"
import { useMaterialsContext } from "../../hooks/useMaterialsContext"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons"
import styles from "./DeleteButton.module.css";

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

    const deleteIcon = <FontAwesomeIcon icon={faTrashCan} size="xl" />
    const saveIcon = <FontAwesomeIcon icon={faFloppyDisk} className={styles.dialogBtnIcon} />
    const confirmYesDeleteIcon = <FontAwesomeIcon icon={faTrash} className={styles.dialogBtnIcon} />
    
    return (
        <div className={styles.deleteDiv}>
            <span
                className={styles.deleteSpan}
                onClick={handleDeleteClick}
            >
                {deleteIcon}
            </span>

            {showDialog && (
                <dialog open className={styles.dialogConfirmDelete}>
                    <h2 className={styles.confirmDelete}>Confirm Deletion</h2>
                    <p><strong>Do you want to delete this item?</strong></p>
                    <p>Choosing the delete button here cannot be undone.</p>
                    <div className={styles.confirmDeleteBtns}>
                        <button
                            className={styles.yesDeleteBtn}
                            onClick={handleConfirmDelete}
                        >
                            {confirmYesDeleteIcon} Yes, delete
                        </button>
                        <button
                            className={styles.noCancelDeleteBtn}
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
