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
// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCalendarDays,
    faPlus,
    faUndo,
    faSort,
    faForward,
    faBackward,
} from "@fortawesome/free-solid-svg-icons"
// function formats date fields 
import { format } from "date-fns";

// filter table rows according to selected options (all the tags in document collection)
const TagsSelect = forwardRef(({
    column: { filterValue, setFilter, preFilteredRows, id }
}, ref) => {
    // Calculate the options for filtering
    // using the preFilteredRows
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
            width: "90%",
            maxWidth: "31.25rem",
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

// returns an object with properties to apply to every column in table  
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
                            //collects tags present in both filterValue and rowTags
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
            displayedTags = value.slice(0, limit);
            ellipsis = true;
        }

        return (
            <div className="table-tags-container">
                {displayedTags.map((tag, index) => (
                    <div key={index} className="tag-chip" >
                        {tag}
                    </div>
                ))}
                {ellipsis && <span>...</span>}
            </div>
        )
    }

    const LinkedCell = ({ value, row }) => (
        <div className="table-linked-cell-container">
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

    /* destructure from the table instance 
    access props & functions, simplify managing state */
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

    // create a ref for the TagsSelect component
    const tagsSelectRef = useRef();

    /* use the ref to clear the tags in the TagsSelect 
    component using Reset Table button */
    const clearChildTags = () => {
        tagsSelectRef.current.clearTags();
    };

    // combine to pass into return statement, to avoid inline event handlers
    const handleResetClick = () => {
        resetTable();
        clearChildTags();
    };

    // Toggle visbility DateRangeFilter, too large for UI
    const [isOpen, setIsOpen] = useState(false)

    const calendarIcon = <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
    const createNewIcon = <FontAwesomeIcon icon={faPlus} />
    const resetIcon = <FontAwesomeIcon icon={faUndo} />
    const sortIcon = <FontAwesomeIcon icon={faSort} size="2xl" className="sort-icon" />
    const forwardsIcon = <FontAwesomeIcon icon={faForward} />
    const backwardsIcon = <FontAwesomeIcon icon={faBackward} />

    /* pagination functions */
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

    // rendering options before table aims for easy user experience
    return (
        <>
            <div className="options-container">
                <span>
                    <button
                        className="date-range-btn"
                        onClick={() => setIsOpen(true)}
                    >
                        {calendarIcon} Filter by Dates
                    </button>
                </span>
                <ModalDateRangeFilter
                    open={isOpen}
                    onClose={() => setIsOpen(false)}>
                    <DateRangeFilter handleFilter={handleDateFilter} />
                </ModalDateRangeFilter>

                <span>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </span>

                <span>
                    <button
                        className="reset-table-btn"
                        onClick={() => {
                            resetTable()
                            clearChildTags()
                        }}
                    >
                        {resetIcon} RESET
                    </button>
                </span>
                <span>
                    <Link to="/create_new">
                        <button
                            className="create-new-btn"
                        >
                            {createNewIcon} Create New
                        </button>
                    </Link>
                </span>
            </div>

            <div className="table-container">
                <table {...getTableProps()} className="table-no-gaps">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="table-header"
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
                                    className="table-row">
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="table-cell"
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
                <div className="pagination">
                    <select
                        className="select-box"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <option value={""}>-- Show Me More --</option>
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>
                                Show {size} Rows
                            </option>
                        ))}
                    </select>
                    <button
                        className="table-pagination-button"
                        onClick={handleResetClick}>
                        {resetIcon} RESET
                    </button>
                    <span aria-label="Display current page number out of total pages">
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <span className="go-to-page-text" aria-label="Go to specific page">
                        | Go to page: {" "}
                        <input className="page-input" aria-label="Page number"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={handlePageChange}
                        />
                    </span>
                    <button
                        className="table-pagination-button"
                        aria-label="Go to previous page"
                        onClick={goToFirstPage}
                        disabled={!canPreviousPage}
                    >
                        {backwardsIcon}
                    </button>
                    <button
                        className="table-pagination-button"
                        onClick={goToPreviousPage}
                        disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className="table-pagination-button"
                        aria-label="Go to next page"
                        onClick={goToNextPage}
                        disabled={!canNextPage}
                    >
                        Next
                    </button>
                    <button
                        className="table-pagination-button"
                        aria-label="Go to next page"
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