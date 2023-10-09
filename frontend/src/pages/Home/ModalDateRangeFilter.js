// DateRangeFilter needs visibility toggle else too large for page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"

function ModalDateRangeFilter({ open, children, onClose }) {
  if (!open) return null

  const closeIcon = <FontAwesomeIcon icon={faCircleXmark} className="close-date-range-btn-icon" size='4x' />

  return (
    <div>
      {children}
      <button className="close-date-range-btn" onClick={onClose} aria-label="Close">{closeIcon}</button>
    </div>
  )
}

export default ModalDateRangeFilter;