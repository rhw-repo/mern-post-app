/* uncommenting line 31 allows check document _id*/
import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Edit from "./Edit";
import Footer from "../components/Footer";
import CancelButton from "../components/CancelButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"

const ContentDetail = () => {
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

    const editIcon = <FontAwesomeIcon icon={faPenToSquare} />

    return (
        <>
            <div className="content-detail">
                {isEditing ? (
                    <Edit material={material} onUpdateComplete={handleUpdateComplete} />
                ) : (
                    <div>
                        {/*  <h3>Id is {_id}</h3> */}
                        {isPending && <div>Loading...</div>}
                        {error && <div>{error}</div>}
                        {material && (
                            <article>
                                <div className="content-detail-title">{material.title}</div>
                                <div className="content-detail-content">{material.content}</div>
                                <div className="document-form-headings content-detail-tags-label" >Tags:</div>
                                <div className="content-detail-tags-container">
                                    {material.tags.map((tag, index) => (
                                        <span key={index} className=" tags tag-chip">{tag}</span>
                                    ))}
                                </div>
                            </article>
                        )}
                        <div className="content-detail-edit-create-btns">
                            <CancelButton />
                            <button
                                className="go-to-edit-btn"
                                onClick={handleUpdateClick}>
                                {editIcon} Edit
                            </button>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </>
    )
}

export default ContentDetail;

