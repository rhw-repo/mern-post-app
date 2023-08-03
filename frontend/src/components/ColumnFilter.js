/* provide logical && searching and work in conjunction with global filter
TODO: 1. create function sanitise to prevent XSS attacks 
*/
import { useEffect } from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"

// icon is SVG not CSS: styled component allows icon in placeholder
const SearchBox = styled.div`
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-left: 1rem;
    padding: 0 0.5rem 0 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    transition: border-color 0.3s; // Smooth transition for border color

    & input {
        border: none;
        flex-grow: 1;
        outline: none; // Removing default focus outline
        font-size: 1rem;
        margin-left: 0.625rem;
    }

    & .filter-icon {
        color: var(--secondary); // Default color for SVG icon
        margin-right: 0.312rem;
        transition: color 0.3s, transform 0.3s; // Smooth transition for color and scaling
    }

    &:hover {
        border-color: var(--outline);

        & .filter-icon {
            color: #667B99;; // More distinct darker shade for hover
            transform: scale(1.1); // Slightly scaled up for hover
        }
    }

    & input:focus + .filter-icon {
        color: #556672; // Even more distinct darker shade for focus
        transform: scale(1.2); // Further scaled up for focus
    }
    }
`

const filterIcon = <FontAwesomeIcon icon={faFilter} className="filter-icon" />

const ColumnFilter = ({ column }) => {
    // console.log(column)
    useEffect(() => {
        console.log('Component updated')
    }, [])

    const { filterValue, setFilter } = column

// increased css specificty to override general input style rules
    const customStyles = {
        boxShadow: "none",
    }

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
                            style={customStyles}
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