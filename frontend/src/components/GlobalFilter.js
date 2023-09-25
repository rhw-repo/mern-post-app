// multiple terms, finds match(es) in the 1st applicable column. 
import { useState, useEffect } from "react";
import { useAsyncDebounce } from "react-table";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"

// icon is SVG not CSS: styled component allows icon in placeholder
const SearchBox = styled.div`
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin: 0.312rem auto;
    padding: 0 0.5rem 0 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

 
    & input {
        border: none;
        flex-grow: 1;
    }

    & .filter-icon {
        color: var(--secondary-light); // Default color for SVG icon
        transition: color 0.3s, transform 0.3s; // Smooth transition for color and scaling
    }

    &:hover {
        border-color: var(--secondary);

        & .filter-icon {
            color: #445566; // More distinct darker shade for hover
            transform: scale(1.1); // Slightly scaled up for hover
        }
    }

    & input:focus + .filter-icon {
        color: #334455; // Even more distinct darker shade for focus
        transform: scale(1.2); // Further scaled up for focus
    }
  
}   
`
const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)

    //  adds useEffect synchronizing local state with prop to 
    // ensure resetTable functions 
    useEffect(() => {
        setValue(filter);
    }, [filter]);

    // Delays filter execution preventing unnecessary operations, better performance
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 300)

    const filterIcon = <FontAwesomeIcon icon={faFilter} className="filter-icon" />

    return (
        <div className="global-filter-div">
            <span className="global-filter-span">
                <SearchBox>
                    {filterIcon}
                    <input
                        type="text"
                        placeholder="Search in all columns..."
                        value={value || ""}
                        onChange={(e) => {
                            setValue(e.target.value)
                            onChange(e.target.value)
                        }}
                        className="global-filter-input"
                    />
                </SearchBox>
            </span>
        </div>
    )
}

export default GlobalFilter;