// DateRangeFilter needs visibility toggle else too large for page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import styles from "./ModalDateRangeFilter.module.css";

function ModalDateRangeFilter({ open, children, onClose }) {
  if (!open) return null

  const closeIcon = <FontAwesomeIcon icon={faCircleXmark} className={styles.closeDateRangeBtnIcon} size='4x' />

  return (
    <div className={styles.modalContainer}>
      {children}
      <button
        className={styles.closeDateRangeBtn}
        onClick={onClose}
        aria-label="Close"
      >
        {closeIcon}
      </button>
    </div>
  )
}

export default ModalDateRangeFilter;