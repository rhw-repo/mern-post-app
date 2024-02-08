import styles from "./Table.module.css";
import { useTable, usePagination, useSortBy, useGlobalFilter, useFilters } from "react-table";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import DateRangeFilter, { filterByDateRange } from "./DateRangeFilter";
import ModalDateRangeFilter from "./ModalDateRangeFilter";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef, forwardRef, useImperativeHandle, Fragment } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faChevronDown,
    faCalendarDays,
    faFile,
    faUndo,
    faSort,
    faForward,
    faBackward,
    faTrashCan
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
            /* Prevents Select containers expanding widthways without limit */
            maxWidth: "16rem",
            border: state.isFocused ? "1px solid var(--secondary-light)" : "1px solid #e6e6e6",
            margin: "1rem auto",
            boxShadow: state.isFocused ? "0 0 0 1px var(--secondary-light)" : baseStyles.boxShadow,
            "&:hover": {
                border: state.isFocused ? "1px solid var(--secondary-light)" : "1px solid #e6e6e6",
            }
        }),
        menu: (baseStyles, state) => ({
            ...baseStyles,
            width: "14rem",
            zIndex: 999,
        }),
        /* Horizontal space between options & scrollbar */
        menuList:
            (baseStyles, state) => ({
                ...baseStyles,
                padding: "0.5rem",

            }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            color: "var(--secondary)",
            fontSize: "1rem",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            maxWidth: "100%",
            padding: "1rem 0.5rem",
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
                /*Limits width of displayed selected options */
                whiteSpace: "nowrap",
                overflow: "ellipsis",
                /* Centers text within displayed selected options */
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0 0.2rem",
            }
        },
        /* Text of displayed selected options */
        multiValueLabel: (baseStyles, state) => {
            return {
                ...baseStyles,
                color: "#fffffff",
                fontSize: "1rem",
            }
        },
        multiValueRemove: (baseStyles, state) => {
            return {
                ...baseStyles,
                color: "#fffffff",
                fontSize: "1rem",
                padding: "0.9rem",
            }
        },
        /* Limits height of container displaying selected options, scrolling */
        /* maxWidth ensures they fill container widthways */
        valueContainer: (baseStyles, state) => {
            return {
                ...baseStyles,
                maxWidth: "100%",
                maxHeight: "7.375rem",
                overflowY: "auto",
            }
        },
        dropdownIndicator: (baseStyles, state) => {
            return {
                ...baseStyles,
                padding: "0.9rem",
                color: "var(--secondary)",
            }
        },
        clearIndicator: (baseStyles, state) => {
            return {
                ...baseStyles,
                padding: "0.9rem",
                color: "var(--secondary)",
            }
        },
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
            menuPosition="fixed"
            placeholder="Search by tags"
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

    // Function to toggle the visibility
    const toggleOptionsVisibility = () => {
        setIsOptionsVisible(prevState => !prevState)
    }

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

    const TextCell = ({ value }) => (
        <div className={styles.tableTextCellContainer}>
            {value}
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
                meta: { ariaLabel: "Document Titles" },
            },
            {
                Header: "Content",
                accessor: "content",
                disableSortBy: true,
                Cell: TextCell,
                meta: { ariaLabel: "Document Contents" },
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
                meta: { ariaLabel: "Document tags" },
            },
            {
                Header: "Created On",
                accessor: "createdAt",
                Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
                filter: filterByDateRange,
                meta: { ariaLabel: "Date documents created on" },
            },
            {
                Header: "Updated On",
                accessor: "updatedAt",
                Cell: ({ value }) => { return format(new Date(value), "dd/MM/yyyy") },
                meta: { ariaLabel: "Date documents updated on" },
            },
            {
                Header: "Delete?",
                accessor: "_id",
                disableSortBy: true,
                disableFilters: true,
                // TODO refactor into component, pass in, avoid code smell
                Cell: ({ value }) => <DeleteButton _id={value} />,
                meta: { ariaLabel: "Delete individual documents" },
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
    const [isOptionsVisible, setIsOptionsVisible] = useState(false)

    const seeTableOptionsButtonIcon = <FontAwesomeIcon icon={faChevronDown} />
    const calendarIcon = <FontAwesomeIcon icon={faCalendarDays} className={styles.calendarIcon} />
    const createNewIconFile = <FontAwesomeIcon icon={faFile} className={styles.createNewIconFile} />
    const resetIcon = <FontAwesomeIcon icon={faUndo} className={styles.resetTableBtnIcon} />
    const sortIcon = <FontAwesomeIcon icon={faSort} size="2xl" className={styles.sortIcon} />
    const deleteIcon = <FontAwesomeIcon icon={faTrashCan} size="xl" />
    const forwardsIcon = <FontAwesomeIcon icon={faForward} />
    const backwardsIcon = <FontAwesomeIcon icon={faBackward} />

    /* Handles navigation to CreateNew.js */
    const navigate = useNavigate()

    const handleNavigation = () => {
        navigate("/create_new")
    }

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

    // state for aria-live messages
    const [liveMessage, setLiveMessage] = useState("")

    // Rendering options before table aims for easy user experience
    return (
        <main>
            <section aria-label="Table Filtering Options Section">
                <button className={styles.seeTableOptionsButton}
                    onClick={toggleOptionsVisibility}
                    aria-expanded={isOptionsVisible}
                >
                    Search & Options {seeTableOptionsButtonIcon}
                </button>
            </section>
            <div aria-live="polite" className={styles.ariaLiveHidden}>
                {liveMessage}
            </div>
            <section aria-label="Table Filtering Options Section" className={`${styles.optionsContainer} ${isOptionsVisible ? styles.visible : ''}`}>
                <div>
                    <button
                        className={`${styles.dateRangeBtn} date-range-btn`}
                        onClick={() => setIsOpen(true)}
                        aria-label="Filter the table by dates"
                    >
                        {calendarIcon} Search Dates
                    </button>
                </div>
                <ModalDateRangeFilter
                    open={isOpen}
                    onClose={() => {
                        setIsOpen(false);
                        setLiveMessage("Date Range Filtering Section closed");
                    }}>
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
                        aria-label="Reset the table after filtering"
                    >
                        {resetIcon} RESET
                    </button>
                </div>
                <div className={styles.createNewDiv}>
                    <button
                        className={`${styles.createNewBtn} create-new-btn`}
                        onClick={handleNavigation}
                        aria-label="Go to Create new item page"
                    >
                        {createNewIconFile} Create New
                    </button>
                </div>
            </section>

            <div className={styles.tableContainer}>
                <table {...getTableProps()} className={styles.tableNoGaps}>
                    <caption className={styles.tableHiddenCaption}>Table of saved documents</caption>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <Fragment key={headerGroup.id}>
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps()}
                                            aria-label={column.meta?.ariaLabel || column.Header}

                                            className={styles.tableHeader}
                                            id={`header-${column.id}`}
                                            scope="col"

                                        >
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                                <tr>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps()}
                                            className={styles.filterHeader}
                                            scope="col"
                                        >
                                            {column.Header === 'Delete?' ? (
                                                <div
                                                    className={styles.headerDeleteIcon}
                                                    aria-label="Column of delete buttons"
                                                >
                                                    {deleteIcon}
                                                </div>
                                            ) : (
                                                <div aria-labelledby={`header-${column.id}`}>
                                                    {column.canFilter ? column.render("Filter") : null}
                                                    {column.canSort ? (
                                                        <button
                                                            {...column.getSortByToggleProps()}
                                                            aria-label={`Sort by date ${column.Header}`}
                                                            className={`${styles.dateSortToggleButtons} ${styles.sortButton}`}
                                                        >
                                                            {sortIcon}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </Fragment>
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

                <section aria-label="Table Pagination Options" className={styles.pagination}>
                    <label htmlFor="table-pagination-select" className={styles.hiddenPaginationSelectLabel}>Rows per page:</label>
                    <select
                        id="table-pagination-select"
                        className={`${styles.SelectBox} select-box`}
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <option value={""}>Show More Table Rows</option>
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
                            min="1"
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
                </section>
            </div>
        </main>
    )
}

export default Table