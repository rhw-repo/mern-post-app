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
                <dialog open>
                    <p>Are you sure you want to delete this?</p>
                    <button onClick={handleConfirmDelete}>Yes, delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                </dialog>
            )}
        </div>
    )
}

export default DeleteButton
