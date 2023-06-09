// DateRangeFilter needs visibility toggle else too large for page
function ModalDateRangeFilter({ open, children, onClose }) {
    if(!open) return null

  return (
    <div> 
        {children}
        <button className="close_date_range" onClick={onClose}>X Close</button>
    </div>
  )
}

export default ModalDateRangeFilter;