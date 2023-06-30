/* provide logical && searching and work in conjunction with global filter
TODO: 1. create function sanitise to prevent XSS attacks */
import { useEffect } from "react";

const ColumnFilter = ({ column }) => {
    // console.log(column)
    useEffect(() => {
        console.log('Component updated')
      }, [])
      
    const { filterValue, setFilter } = column
    // hides input in date columns (DateRangeFilter used instead or no filter)
    if (column.Header !== "Created At" && column.Header !== "Updated At" && column.Header!=="Delete") {
        return (
            <div>
                <span>
                    <input
                        type="text"
                        placeholder="Search this column..."
                        value={filterValue || ""}
                        onChange={e => setFilter(e.target.value)}
                    />
                </span>
            </div>
        )
    } else {
        return null
    }
}

export default ColumnFilter;