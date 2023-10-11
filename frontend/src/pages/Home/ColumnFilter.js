// provides logical && searching and works in conjunction with global filter
import { useEffect } from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"

// icon is SVG not CSS: styled component allows icon in placeholder
// Note - no modules.css for ColumnFilter.js
const SearchBox = styled.div`
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-left: 1rem;
    padding: 0 0.5rem 0 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    transition: border-color 0.3s; 

    & input {
        border: none;
        flex-grow: 1;
        outline: none; 
        font-size: 1rem;
        margin-left: 0.625rem;
    }

    & .filter-icon {
        color: var(--secondary-light); 
        margin-right: 0.312rem;
        transition: color 0.3s, transform 0.3s; 
    }

    &:hover {
        border-color: var(--outline);

        & .filter-icon {
            color: #445566; 
            transform: scale(1.1); 
        }
    }

    & input:focus + .filter-icon {
        color:  #334455; 
        transform: scale(1.2); 
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