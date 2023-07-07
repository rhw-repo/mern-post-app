import { useState } from "react"
// TODO 1. Style this dialog box (confirms delete)

import { useMaterialsContext } from "../hooks/useMaterialsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"


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
        });

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

    return (
        <div>
            <span
                className="material-symbols-outlined"
                onClick={handleDeleteClick}
            >
                delete
            </span>

            {showDialog && (
                <dialog open className="dialog_confirm_delete">
                    <h2 className="confirm_delete">Just checking - </h2>
                    <p><strong>Did you want to click on DELETE?</strong></p>
                    <p>If you delete it, it will be gone forever.</p>
                    <div className="confirm_delete_buttons">
                        <button className="yes_delete" onClick={handleConfirmDelete}>Yes, delete</button>
                    <button className="no_cancel_delete" onClick={handleCancelDelete}>No! Keep it!</button>
                        </div>
                </dialog>
            )}
        </div>
    )
}

export default DeleteButton
