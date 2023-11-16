/* uncommenting line 31 allows check document _id*/
import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Edit from "./Edit";
import CancelButton from "../../components/CancelButton/CancelButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import styles from "./ContentDetail.module.css";

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
            <div className="content-detail-edit-create-containers">
                {isEditing ? (
                    <Edit material={material} onUpdateComplete={handleUpdateComplete} />
                ) : (
                    <div>
                        {/*  <h3>Id is {_id}</h3> */}
                        {isPending && <div>Loading...</div>}
                        {error && <div>{error}</div>}
                        {material && (
                            <article>
                                <div className={styles.contentDetailTitle}>{material.title}</div>
                                <div className={styles.contentDetailContent}>{material.content}</div>
                                <div className={`${styles.contentDetailTagsLabel} document-form-headings`}>Tags:</div>
                                <div className="content-detail-tags-container">
                                    {material.tags.map((tag, index) => (
                                        <span key={index} className={` ${styles.tags} ${styles.tagChip} tags tag-chip`}>{tag}</span>
                                    ))}
                                </div>
                            </article>
                        )}
                        <div className="content-detail-edit-create-btns">
                            <CancelButton />
                            <button
                                className={`go-to-edit-btn ${styles.goToEditBtn}`}
                                onClick={handleUpdateClick}>
                                {editIcon} Edit
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default ContentDetail;

