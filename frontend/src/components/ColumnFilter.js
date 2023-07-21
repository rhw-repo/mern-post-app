/* provide logical && searching and work in conjunction with global filter
TODO: 1. create function sanitise to prevent XSS attacks */
import { useEffect } from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"

// icon is SVG not CSS: styled component allows icon in placeholder
const SearchBox = styled.div`
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin: 0.312rem auto;
    padding: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    & input {
        border: none;
        flex-grow: 1;
    }

    & svg {
        color: gray;
    }
`

const filterIcon = <FontAwesomeIcon icon={faFilter} />

const ColumnFilter = ({ column }) => {
    // console.log(column)
    useEffect(() => {
        console.log('Component updated')
    }, [])

    const { filterValue, setFilter } = column
    // hides input in date columns (DateRangeFilter used instead or no filter)
    if (column.Header !== "Created At" && column.Header !== "Updated At" && column.Header !== "Delete") {
        return (
            <div>
                <span>
                    <SearchBox>
                        {filterIcon}
                        <input
                            type="text"
                            placeholder="Search this column..."
                            value={filterValue || ""}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </SearchBox>
                </span>
            </div>
        )
    } else {
        return null
    }
}

export default ColumnFilter;