import styles from "./Table.module.css";
import { useTable, usePagination, useSortBy, useGlobalFilter, useFilters } from "react-table";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import DateRangeFilter, { filterByDateRange } from "./DateRangeFilter";
import ModalDateRangeFilter from "./ModalDateRangeFilter";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useMemo, useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendarDays,
    faFile,
    faUndo,
    faSort,
    faForward,
    faBackward
} from "@fortawesome/free-solid-svg-icons"
// Formats date fields 
import { format } from "date-fns";

// Filter table rows according to selected options (all the tags in document collection)
const TagsSelect = forwardRef(({
    column: { filterValue, setFilter, preFilteredRows, id }
}, ref) => {
    /* Calculate the options for filtering
    using the preFilteredRows */
    const options = useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach((row) => {
            // console.log("line 36", row)
            let tagsArray = row.values[id]
            //   console.log(id)
            for (const tag of tagsArray) {
                //  console.log(tag)

                options.add(tag);
            }
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    const changeHandler = (newValue, action) => {
        console.log(newValue, action)
        let filterValue = newValue.map(nv => nv.value)
        setFilter(filterValue)
    }

    const customStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            cursor: "pointer",
            width: "100%",
            maxWidth: "100%",
            border: state.isFocused ? "1px solid var(--secondary-light)" : "1px solid #e6e6e6",
            margin: "1rem auto",
            boxShadow: state.isFocused ? "0 0 0 1px var(--secondary-light)" : baseStyles.boxShadow,
            "&:hover": {
                border: state.isFocused ? "1px solid var(--secondary-light)" : "1px solid #e6e6e6",
            }
        }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            color: "var(--secondary)",
            fontSize: "1rem",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            backgroundColor: state.isFocused ? "var(--secondary-light)" : baseStyles.backgroundColor,
            color: state.isFocused ? "white" : baseStyles.color,
            ":hover": {
                backgroundColor: "var(--secondary-light)"
            }
        }),
        multiValue: (baseStyles, state) => {
            return {
                ...baseStyles,
                backgroundColor: "var(--secondary-chips)",
                color: "white",
            }
        },
        multiValueLabel: (baseStyles, state) => {
            return {
                ...baseStyles,
                color: "white",
            }
        }
    }

    const selectorRef = useRef();

    const clearTags = () => {
        selectorRef.current.clearValue();
    }

    // Render a multi-select box
    let selectOptions = options.map(option => ({ value: option, label: option }))

    // Use useImperativeHandle to expose the clearTags function
    useImperativeHandle(ref, () => ({
        clearTags
    }))

    return (
        <Select
            ref={selectorRef}
            onChange={changeHandler}
            options={selectOptions}
            isMulti
            styles={customStyles}
            aria-label="Select tags"
        />
    );
});

// Returns an object with properties to apply to every column in table  
function Table({ data }) {

    const filterTypes = useMemo(
        function () {
            return {
                contains: (rows, id, filterValue) => {
                    console.log(rows, id, filterValue)

                    return rows.filter(row => {
                        let mutualItems = []
                        let rowTags = row.values[id]
                        for (const tag of filterValue) {
                            // Collects tags present in both filterValue and rowTags
                            if (rowTags.includes(tag)) {
                                mutualItems.push(tag)
                            }
                        }

                        if (mutualItems.length === filterValue.length) {
                            return true;
                        }

                        return false
                    })

                }
            }
        }, []
    )

    const defaultColumn = useMemo(
        () => ({
            Filter: ColumnFilter,
            width: 60,
            maxWidth: 50,
        }),
        []
    )

    useEffect(() => {
        console.log("Component updated")
    }, [])

    const TagCell = ({ value, limit }) => {
        let displayedTags = value;
        let ellipsis = false;

        if (value.length > limit) {
            displayedTags = value.slice(0, limit)
            ellipsis = true
        }
        // Limit width of displayed tag in tag column
        const trimText = (text, maxLength) => {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + "..."
            }
            return text
        }

        return (
            <div className={`${styles.tableTagsContainer} ${styles.centerTableTags}`}>
                {displayedTags.map((tag, index) => (
                    <div key={index} className={` ${styles.tagChipTable} ${styles.centerTableTags}`} >
                        {trimText(tag, 16)}
                    </div>
                ))}
                {ellipsis && <span>...</span>}
            </div>
        )
    }

    const LinkedCell = ({ value, row }) => (
        <div className={styles.tableLinkedCellContainer}>
            <Link to={`/articles/${row.original._id}`}>{value}</Link>
        </div>
    )

    // useMemo prevents unnecessary recalculations (better performance)
    const columns = useMemo(
        () => [
            {
                Header: "Title",
                accessor: "title",
                disableSortBy: true,
                Cell: LinkedCell,
            },
            {
                Header: "Content",
                accessor: "content",
                disableSortBy: true,
                Cell: LinkedCell,
            },
            {
                Header: "Tags",
                accessor: "tags",
                Cell: props => <TagCell {...props} limit={1} />,
                disableSortBy: true,
                filter: "contains",
                // Filter: TagsSelect
                // No forwardRef needed, just pass the ref
                Filter: (props) => <TagsSelect {...props} ref={tagsSelectRef} />,
            },
            {
                Header: "Created At",
                accessor: "createdAt",
                Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
                filter: filterByDateRange,
            },
            {
                Header: "Updated At",
                accessor: "updatedAt",
                Cell: ({ value }) => { return format(new Date(value), "dd/MM/yyyy") },
            },
            {
                Header: "",
                accessor: "_id",
                disableSortBy: true,
                disableFilters: true,
                // TODO refactor into component, pass in, avoid code smell
                Cell: ({ value }) => <DeleteButton _id={value} />,
            }
        ],
        []
    )

    /* Destructure from the table instance 
    Access props & functions, simplify managing state */
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        setGlobalFilter,
        prepareRow,
        setFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: { pageIndex: 0, pageSize: 3 },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    const { pageIndex, pageSize, globalFilter } = state

    const handleDateFilter = (selectedRange) => {
        setFilter("createdAt", selectedRange)
    }

    // Clear pagination selections or global/column/date range filters
    const resetTable = () => {
        setGlobalFilter("");
        setPageSize(3);
        columns.forEach(column => {
            setFilter(column.accessor, undefined)

        })
        gotoPage(0)
    }

    // Create a ref for the TagsSelect component
    const tagsSelectRef = useRef();

    /* Use the ref to clear the tags in the TagsSelect 
    component using Reset Table button */
    const clearChildTags = () => {
        tagsSelectRef.current.clearTags();
    };

    // Combine to pass into return statement, to avoid inline event handlers
    const handleResetClick = () => {
        resetTable();
        clearChildTags();
    };

    // Toggle visbility DateRangeFilter, too large for UI
    const [isOpen, setIsOpen] = useState(false)

    const calendarIcon = <FontAwesomeIcon icon={faCalendarDays} className={styles.calendarIcon} />
    const createNewIconFile = <FontAwesomeIcon icon={faFile} />
    const resetIcon = <FontAwesomeIcon icon={faUndo} />
    const sortIcon = <FontAwesomeIcon icon={faSort} size="2xl" className={styles.sortIcon} />
    const forwardsIcon = <FontAwesomeIcon icon={faForward} />
    const backwardsIcon = <FontAwesomeIcon icon={faBackward} />

    /* Pagination functions */
    const handlePageSizeChange = (e) => {
        const selectedPageSize = e.target.value === ""
            ? undefined : Number(e.target.value)
        setPageSize(selectedPageSize || 3)
    }

    const handlePageChange = (e) => {
        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
        gotoPage(pageNumber);
    };

    const goToFirstPage = () => {
        gotoPage(0);
    };

    const goToPreviousPage = () => {
        previousPage();
    };

    const goToNextPage = () => {
        nextPage();
    };

    const goToLastPage = () => {
        gotoPage(pageCount - 1);
    };

    // Rendering options before table aims for easy user experience
    return (
        <>
            <div className={styles.optionsContainer}>
                <div>
                    <button
                        className={`${styles.dateRangeBtn} date-range-btn`}
                        onClick={() => setIsOpen(true)}
                    >
                        {calendarIcon} Search Dates
                    </button>
                </div>
                <ModalDateRangeFilter
                    open={isOpen}
                    onClose={() => setIsOpen(false)}>
                    <DateRangeFilter handleFilter={handleDateFilter} />
                </ModalDateRangeFilter>

                <div className={styles.globalFilter}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>

                <div className={styles.resetTableBtnDiv}>
                    <button
                        className={`${styles.resetTableBtn} reset-table-btn`}
                        onClick={() => {
                            resetTable()
                            clearChildTags()
                        }}
                    >
                        {resetIcon} RESET
                    </button>
                </div>
                <div className={styles.createNewDiv}>
                    <Link to="/create_new">
                        <button
                            className={`${styles.createNewBtn} create-new-btn`}
                        >
                           {createNewIconFile} Create New
                        </button>
                    </Link>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table {...getTableProps()} className={styles.tableNoGaps}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={styles.tableHeader}
                                    >
                                        {column.render("Header")}
                                        <div>{column.canFilter ? column.render("Filter") : null}</div>
                                        {
                                            column.canSort
                                                ? (
                                                    column.isSorted
                                                        ? (column.isSortedDesc ? sortIcon : sortIcon)
                                                        : sortIcon
                                                )
                                                : null
                                        }

                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}
                                    className={styles.tableRow}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={styles.tableCell}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <select
                        className={`${styles.SelectBox} select-box`}
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <option value={""}>Show Me More</option>
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>
                                Show {size} Rows
                            </option>
                        ))}
                    </select>
                    <button
                        className={`${styles.tablePaginationButton} ${styles.tablePaginationReset} table-pagination-button`}
                        onClick={handleResetClick}>
                        {resetIcon} RESET
                    </button>
                    <span className={styles.tablePageNumbering}
                    aria-label="Display current page number out of total pages">
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <span className={styles.goToPageText} aria-label="Go to specific page">
                        Go to page: {" "}
                        <input className={styles.pageInput} aria-label="Page number"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={handlePageChange}
                        />
                    </span>
                    <button
                         className={`${styles.tablePaginationButton} ${styles.tablePaginationGoToFirst} table-pagination-button`}
                         aria-label="Go to first page"
                         onClick={goToFirstPage}

                        disabled={!canPreviousPage}
                    >
                        {backwardsIcon}
                    </button>
                    <button
                        className={`${styles.tablePaginationButton} ${styles.tablePaginationPrevious} table-pagination-button`}
                        aria-label="Go to previous page"
                        onClick={goToPreviousPage}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className={`${styles.tablePaginationButton} ${styles.tablePaginationNext} table-pagination-button`}
                        aria-label="Go to next page"
                        onClick={goToNextPage}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                    <button
                        className={`${styles.tablePaginationButton} ${styles.tablePaginationGoToLast} table-pagination-button`}
                        aria-label="Go to last page"
                        onClick={goToLastPage}
                        disabled={!canNextPage}
                    >
                        {forwardsIcon}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Table