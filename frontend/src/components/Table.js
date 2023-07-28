import { useTable, usePagination, useSortBy, useGlobalFilter, useFilters } from 'react-table';
import GlobalFilter from './GlobalFilter';
import ColumnFilter from './ColumnFilter';
import DateRangeFilter, { filterByDateRange } from './DateRangeFilter';
import ModalDateRangeFilter from './ModalDateRangeFilter';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import DeleteButton from "./DeleteButton";
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendarDays,
    faPlus,
    faUndo,
    faSortUp,
    faSortDown,
    faForward,
    faBackward,
} from "@fortawesome/free-solid-svg-icons"
// function formats date fields 
import { format } from "date-fns";

// filter table rows according to selected options (all the tags in document collection)
function TagsSelect({
    column: { filterValue, setFilter, preFilteredRows, id }
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
        const options = new Set();
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
        control: (baseStyles) => ({
            ...baseStyles,
            width: "90%",
            maxWidth: "300px",
            border: "1px solid #e6e6e6",
        })
    }

    // Render a multi-select box
    let selectOptions = options.map(option => ({ value: option, label: option }))

    return (
        <Select
            onChange={changeHandler}
            options={selectOptions}
            isMulti
            styles={customStyles}
        />
    )
}

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
                            if (rowTags.includes(tag)) {
                                //as soon as you find something return true
                                // return true 
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
        }
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
        console.log('Component updated')
    }, [])


    // useMemo prevents unnecessary recalculations (better performance)
    const columns = useMemo(
        () => [
            {
                Header: "Title",
                accessor: "title",
                disableSortBy: true,
                // TODO refactor Link into component, pass in, avoid code smell
                Cell: ({ value, row }) => (
                    <Link to={`/articles/${row.original._id}`}>{value}</Link>
                ),
            },
            {
                Header: "Content",
                accessor: "body",
                disableSortBy: true,
                // TODO refactor Link into component, pass in, avoid code smell
                Cell: ({ value, row }) => (
                    <Link to={`/articles/${row.original._id}`}>{value}</Link>
                ),
            },
            {
                Header: "Tags",
                accessor: "tags",
                width: 100,
                /*   Cell: ({ value }) => {
                     return value.length > 4 ? `${value[0]}, ${value[1]}, ...` : value.join(', ');
                 },*/

                Cell: ({ value }) => {
                    if (value.length > 3) {
                        const slicedTags = value.slice(0, 4);
                        return `${slicedTags.join(", ")}, ...`;
                    } else {
                        return value.join(", ");
                    }
                },
                disableSortBy: true,
                filter: "contains",
                Filter: TagsSelect,
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
            initialState: { pageIndex: 0, pageSize: 4 },
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

    // Clear pagination selections or global/column/date/tags filters
    const resetTable = () => {
        setGlobalFilter('');
        setPageSize(4);
        columns.forEach(column => {
            setFilter(column.accessor, undefined)

        })
        gotoPage(0)
    }

    // Toggle visbility DateRangeFilter, too large for UI
    const [isOpen, setIsOpen] = useState(false)

    const calendarIcon = <FontAwesomeIcon icon={faCalendarDays} />
    const createNewIcon = <FontAwesomeIcon icon={faPlus} />
    const resetIcon = <FontAwesomeIcon icon={faUndo} />
    const sortUpIcon = <FontAwesomeIcon icon={faSortUp} size="xl" style={{color: "#E0E0E0",}} />
    const sortDownIcon = <FontAwesomeIcon icon={faSortDown} size="xl" style={{color: "#E0E0E0",}} />
    const forwardsIcon = <FontAwesomeIcon icon={faForward} />
    const backwardsIcon = <FontAwesomeIcon icon={faBackward} />

    // rendering options_container before table aims for easy user experience
    return (
        <>
            <div className="options_container">
                <span>
                    <button
                        className="date_range_btn"
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
                        className="reset_table_btn"
                        onClick={resetTable}
                    >
                        {resetIcon} RESET
                    </button>
                </span>

                <span>
                    <Link to="/create_new">
                        <button
                            className="create_new_btn"
                        >
                            {createNewIcon} Create New
                        </button>
                    </Link>
                </span>
            </div>

            <div style={{
                width: "100%",
                border: "solid 1px white",
                borderRadius: "0.625rem",
                overflow: "hidden",
                boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.2), " +
                    "0px 4px 5px 0px rgba(0, 0, 0, 0.14), " +
                    "0px 1px 10px 0px rgba(0, 0, 0, 0.12), " +
                    "0.3125rem 0.3125rem 0.3125rem 0.3125rem #778DA5"
            }}>
                <table {...getTableProps()}
                    style={{ width: "100%", borderSpacing: 0 }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            borderBottom: "solid 3px #BD7374",
                                            background: "white",
                                            color: "black",
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            padding: "1.5rem",
                                            margin: "0.625rem",
                                            textAlign: "center",

                                        }}
                                    >
                                        {column.render("Header")}
                                        <div>{column.canFilter ? column.render("Filter") : null}</div>
                                        {
                                            column.canSort
                                                ? (
                                                    column.isSorted
                                                        ? (column.isSortedDesc ? sortDownIcon : sortUpIcon)
                                                        : sortDownIcon
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
                                    style={{
                                        backgroundColor: row.index % 2 === 0 ? "white" : "#E0E0E0",
                                        maxHeight: "4rem"
                                    }}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: "1rem",
                                                }}
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
                <div style={{ textAlign: "center" }}>
                    <select
                        className="select_box"
                        value={pageSize}
                        onChange={(e) => {
                            const selectedPageSize = e.target.value === ""
                                ? undefined : Number(e.target.value)
                            setPageSize(selectedPageSize || 3)
                        }}
                    >
                        <option value={""}>-- Show Me More --</option>
                        {[5, 10, 20, 50].map(pageSize => (
                            <option
                                key={pageSize} value={pageSize}>
                                Show {pageSize} Rows
                            </option>
                        ))}
                    </select>
                    <button
                        className="table_pagination"
                        onClick={resetTable}>
                        {resetIcon} RESET
                    </button>
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                        | Go to page: {" "}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(pageNumber);
                            }}
                            style={{ width: "3.125rem", marginLeft: "0.5rem" }}
                        />
                    </span>


                    <button
                        className="table_pagination button"
                        onClick={() => gotoPage(0)} disabled={!canPreviousPage}
                    >
                        {backwardsIcon}
                    </button>
                    <button
                        className="table_pagination button"
                        onClick={() => previousPage()} disabled={!canPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className="table_pagination button"
                        onClick={() => nextPage()} disabled={!canNextPage}
                    >
                        Next
                    </button>
                    <button
                        className="table_pagination button"
                        onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}
                    >
                        {forwardsIcon}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Table