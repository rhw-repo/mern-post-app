// Multiple terms, finds match(es) in the 1st applicable column. 
import { useState, useEffect } from "react";
import { useAsyncDebounce } from "react-table";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import styles from "./GlobalFilter.module.css";

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
        color: var(--secondary-light); 
        transition: color 0.3s, transform 0.3s; 
        font-size: 1.5rem;
    }

    &:hover {
        border-color: var(--secondary);

        & .filter-icon {
            color: #445566; 
            transform: scale(1.1); 
        }
    }

    & input:focus + .filter-icon {
        color: #334455; 
        transform: scale(1.2); 
    }
  
}   
`
const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)

    //  Synchronise local state with prop to 
    // ensure resetTable functions 
    useEffect(() => {
        setValue(filter);
    }, [filter]);

    // Delays filter execution preventing unnecessary operations
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 300)

    const filterIcon = <FontAwesomeIcon icon={faFilter} size="lg" className="filter-icon" />

    const handleInputChange = (e) => {
        setValue(e.target.value)
        onChange(e.target.value)
    }

    return (
        <section className={`${styles.globalFilterDiv} ${styles.globalFilter}`}>
            <label htmlFor="global-filter">Search all table</label>
            <SearchBox>
                {filterIcon}
                <input
                    id="global-filter"
                    type="text"
                    value={value || ""}
                    onChange={handleInputChange}
                    className={styles.globalFilterInput}
                    aria-label="Filter table by search terms"
                />
            </SearchBox>
        </section>
    )
}

export default GlobalFilter;