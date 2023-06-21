/* TODO:
1. Add 'confirm' modal for delete button, add highlight input boxes
2. Integrate feature/chips branch user needs to apply labels to their documents
3. Create a reset button for filters 
*/

import { useTable, usePagination, useSortBy, useGlobalFilter, useFilters } from 'react-table';
import GlobalFilter from './GlobalFilter';
import ColumnFilter from './ColumnFilter';
import DateRangeFilter, { filterByDateRange } from './DateRangeFilter';
import ModalDateRangeFilter from './ModalDateRangeFilter';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useMaterialsContext } from '../hooks/useMaterialsContext';
// function formats date fields 
import { format } from "date-fns";

// returns an object with properties to apply to every column in table  
function Table({ data }) {

    const { dispatch } = useMaterialsContext()
    const { user } = useAuthContext()

    const defaultColumn = useMemo(
        () => ({
            Filter: ColumnFilter,
        }),
        []
    )

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
                Header: "Delete?",
                accessor: "_id",
                disableSortBy: true,
                // TODO refactor into component, pass in, avoid code smell
                Cell: ({ value }) => <DeleteButton _id={value} />,
            }
        ],
        []
    )

    // fires when delete button clicked, sends DELETE request passes to backend
    const handleClick = async (_id) => {
        if (!user) {
            return
        }

        const response = await fetch(`api/materials/${_id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: "DELETE_MATERIAL", payload: json })
        }
    }
    // TODO refactor into component, avoid code smell
    // creates a delete button with a trashcan icon
    const DeleteButton = ({ _id }) => (
        <span
            className="material-symbols-outlined"
            onClick={() => handleClick(_id)}
        >
            delete
        </span>
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

    const resetTable = () => {
        setPageSize(3);
        gotoPage(0);
    }

    // Toggle visbility DateRangeFilter using date_range_btn, is too large for UI
    const [isOpen, setIsOpen] = useState(false)

    // rendering options_container before table aims for easy user experience
    return (
        <>
            <div className="options_container">
                <span className="item1">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </span>

                <span className="item2">
                    <button className="date_range_btn"
                        onClick={() => setIsOpen(true)}
                    >
                        Filter by Dates
                    </button></span>
                <ModalDateRangeFilter
                    open={isOpen}
                    onClose={() => setIsOpen(false)}>
                    <DateRangeFilter handleFilter={handleDateFilter} />
                </ModalDateRangeFilter>

                <span className="item3">
                    <Link to="/create_new">
                        <button className="create_new_btn">Create New</button>
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
                                            borderBottom: "solid 3px #BD7374",
                                            background: "white",
                                            color: "black",
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            padding: "1.5rem",
                                            margin: "0.625rem"
                                        }}
                                    >
                                        {column.render("Header")}
                                        <div>{column.canFilter ? column.render("Filter") : null}</div>
                                        {<span
                                            role="img"
                                            aria-label={column.isSorted
                                                ? (column.isSortedDesc
                                                    ? "Ascending order" : "Descending order") : ""}
                                        >
                                            {column.isSorted ? (column.isSortedDesc ? "   🔼" : "   🔽") : ""}
                                        </span>}
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
                        Reset To 3 Rows
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


                    <button className="table_pagination button"
                        onClick={() => gotoPage(0)} disabled={!canPreviousPage}
                    >
                        {"<<"}
                    </button>
                    <button className="table_pagination button"
                        onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <button className="table_pagination button"
                        onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                    <button className="table_pagination button"
                        onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} >
                        {">>"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Table