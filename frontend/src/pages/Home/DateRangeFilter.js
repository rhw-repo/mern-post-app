import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
// function required for filtering by selected date range
import { isWithinInterval } from "date-fns"
import styles from "./DateRangeFilter.module.css";

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

  // state for aria-live messages
  const [liveMessage, setLiveMessage] = useState("")

  // filter table rows by calling handleFilter() after selecting date range
  // aria-live messages announce selected date range
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection
    setDateRange(ranges.selection)
    handleFilter(ranges.selection)
    const formattedStartDate = startDate.toDateString();
    const formattedEndDate = endDate.toDateString();
    setLiveMessage(`Selected date range from ${formattedStartDate} to ${formattedEndDate}.`)
  }
  
  // TODO would need unique exception to CSP: 
  // library seem to inject style into HTML
  const rangeColors = ["#667B99"]

  /* Workaround known library bug no visual indicator
  on focus, no aria-labels month & year selection section */
  useEffect(() => {
    const updateAriaLabels = () => {
      const prevButtons = document.querySelectorAll(".rdrPprevButton")
      const nextButtons = document.querySelectorAll(".rdrNextButton")
      
      prevButtons.forEach(button => {
        button.setAttribute("aria-label", "Previous Month")
      })

      nextButtons.forEach(button => {
        button.setAttribute("aria-label", "Next Month")
      })
    }

    const handleFocusIn = (e) => {
      if (e.target.classList.contains("rdrNextPrevButton")) {
        e.target.style.outline = "2px solid black"
      }
      // Target select elements within spans 
      // className .rdrMonthPicker or .rdrYearPicker
      if (e.target.tagName === 'SELECT' &&
        (e.target.parentNode.classList.contains("rdrMonthPicker") ||
          e.target.parentNode.classList.contains("rdrYearPicker"))) {
        e.target.style.outline = "2px solid black"
      }
    }

    const handleFocusOut = (e) => {
      if (e.target.classList.contains("rdrNextPrevButton")) {
        e.target.style.outline = ""
      }

      if (e.target.tagName === 'SELECT' &&
        (e.target.parentNode.classList.contains("rdrMonthPicker") ||
          e.target.parentNode.classList.contains("rdrYearPicker"))) {
        e.target.style.outline = ""
      }
    }

    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("focusout", handleFocusOut)

    updateAriaLabels()

    // Clean up event listeners
    return () => {
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("focusout", handleFocusOut)
    }
  }, [])

  /* rangeColors prop sets the color scheme of DateRangePicker 
  to match the app's primary color */
  return (
    <>
    <div className={styles.modal}>
    <div aria-live="polite" className="aria-live-hidden">
       {liveMessage}
        </div>
      <DateRangePicker
        className={styles.modal}
        rangeColors={rangeColors}
        showSelectionPreview={false}
        ranges={[dateRange]}
        onChange={handleSelect}
        startDatePlaceholder="start date"
        endDatePlaceholder="end date"
        editableDateInputs
        dateDisplayFormat="dd-MM-yyyy"
      />
    </div>
    </>
  )
}

export default DateRangeFilter;
