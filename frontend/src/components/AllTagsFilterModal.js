/* REDUNDANT

 AllTagsFilter needs visibility toggle else too large for page
function AllTagsFilterModal({ open, children, onClose }) {
    if(!open) return null

  return (
    <div> 
        {children}
        <button className="close_modal_btn" onClick={onClose}>X Close</button>
    </div>
  )
}

export default AllTagsFilterModal;
*/