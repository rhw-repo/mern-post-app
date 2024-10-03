// DateRangeFilter needs visibility toggle else too large for page
import { useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import styles from "./ModalDateRangeFilter.module.css";

function ModalDateRangeFilter({ open, children, onClose }) {
  const modalRef = useRef(null)

  // Listen for Escape key press, call onClose() if pressed
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }

    // Cleanup function removes event listener prevents firing when modal closed 
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  // Trap focus inside open modal 
  useEffect(() => {
    function handleTabKey(event) {
      // Exit function early if key pressed isn't "Tab"
      if (event.key !== "Tab") return;
      //
      const focusableModalElements = modalRef.current.querySelectorAll(
        "button:not([disabled]), textarea, input, select"
      )
      // Identify 1st & last elements 
      const firstElement = focusableModalElements[0]
      const lastElement = focusableModalElements[focusableModalElements.length - 1]
      // When tabbing forwards: move focus from last element to first 
      // Stops default behaviour of tabbing to next focusable element outside modal
      if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
        // Same pattern reversed when tabbing backwards 
      } else if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleTabKey)
    }

    // Cleanup function removes event listener prevents firing when modal closed 
    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [open])

  if (!open) return null

  const closeIcon = <FontAwesomeIcon icon={faCircleXmark} className={styles.closeDateRangeBtnIcon} size='4x' />

  return (
    <div ref={modalRef} className={styles.modalContainer}>
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