/* TODO: 1.  see resetTable() in Table.js
user needs Reset Table button in DateRangeFilter after filtering by date(s) */

import { useState } from "react";
import { DateRangePicker } from "react-date-range";
// function required for filtering by selected date range
import { isWithinInterval } from "date-fns"

// exported & passed to Table.js (separate filter logic & column declarations)

export const filterByDateRange = (rows, columnId, filterValue) => {
  if (filterValue && filterValue.startDate && filterValue.endDate) {
    return rows.filter((row) =>
      isWithinInterval(new Date(row.values[columnId]), {
        start: filterValue.startDate,
        end: filterValue.endDate,
      })
    )
  }
  return rows
}

function DateRangeFilter({ handleFilter }) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  })

  // filter table rows by calling handleFilter() after selecting date range
  const handleSelect = (ranges) => {
    setDateRange(ranges.selection)
    handleFilter(ranges.selection)
  }

  // rangeColors overrides default styling to app's primary color #BD7374
  return (
    <div className="modal">
      <DateRangePicker
        className="modal"
        rangeColors={["#BD7374"]}
        showSelectionPreview={false}
        ranges={[dateRange]}
        onChange={handleSelect} />
    </div>
  )
}

export default DateRangeFilter;
