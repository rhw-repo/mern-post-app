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
        color: #BD7374; // Default color for SVG icon
        transition: color 0.3s, transform 0.3s; // Smooth transition for color and scaling
    }

    &:hover {
        border-color: #778DA5;

        & .filter-icon {
            color: #8E5659; // More distinct darker shade for hover
            transform: scale(1.1); // Slightly scaled up for hover
        }
    }

    & input:focus + .filter-icon {
        color: #6B4045; // Even more distinct darker shade for focus
        transform: scale(1.2); // Further scaled up for focus
    }
  
}   
`
const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)

     // Experiment successful, adds useEffect synchronizing local state with prop to 
     // ensure resetTable functions 
     useEffect(() => {
        setValue(filter);
    }, [filter]);


    // Delays filter execution preventing unnecessary operations, better performance
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 300)

    const filterIcon = <FontAwesomeIcon icon={faFilter} className="filter-icon"/>

    const customStyles = {
        outline: "none", 
        width: "20rem",
        fontSize: "1rem",
        marginLeft: "0.625rem",
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            <span style={{
                fontWeight: "bold",
                fontSize: "1.25rem",
                padding: "0.625rem",
            }}>
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
                        style={customStyles}
                    />
                </SearchBox>
            </span>
        </div>
    )
}

export default GlobalFilter;