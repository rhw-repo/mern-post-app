/* uncommenting line 31 allows check document _id*/
import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Edit from "./Edit";
import Footer from "../components/Footer";
import CancelButton from "../components/CancelButton";

const Read = () => {
    const { _id } = useParams();
    const { data: material, error, isPending } = useFetch(
        "/api/materials/" + _id
    )
    const [isEditing, setIsEditing] = useState(false)

    function handleUpdateClick() {
        setIsEditing(true)
    }

    function handleUpdateComplete() {
        setIsEditing(false)
    }

    return (
        <>
            <div>
            </div>
            <div className="read">
                {isEditing ? (
                    <Edit material={material} onUpdateComplete={handleUpdateComplete} />
                ) : (
                    <div>
                        {/*  <h3>Id is {_id}</h3> */}
                        {isPending && <div>Loading...</div>}
                        {error && <div>{error}</div>}
                        {material && (
                            <article>
                                <div className="read_form_headings">Title:</div>
                                <div className="read_title">{material.title}</div>
                                <div className="read_form_headings">Contents:</div>
                                <div>{material.body}</div>
                                <div className="read_form_headings">Tags:</div>
                                <div className="read-tags-container">
                                    {material.tags.map((tag, index) => (
                                        <span key={index} className=" tags tag-chip">{tag}</span>
                                    ))}
                                </div>
                            </article>
                        )}
                        <div className="read_edit_create_btns">
                            <CancelButton />
                            <button
                                className="go-to-edit-btn"
                                onClick={handleUpdateClick}>
                                Edit
                            </button>

                        </div>
                    </div>
                )}

            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Read;

