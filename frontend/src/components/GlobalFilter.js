// multiple terms, finds match(es) in the 1st applicable column. 
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from "@fortawesome/free-solid-svg-icons"

// icon is SVG not CSS: styled component allows icon in placeholder
const SearchBox = styled.div`
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin: 0.312rem auto;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    & input {
        border: none;
        flex-grow: 1;
    }

    & svg {
        color: #E0E0E0;
    }
`

const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)

    // Delays filter execution preventing unnecessary operations, better performance
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 300)

    const filterIcon = <FontAwesomeIcon icon={faFilter} size="xl"/>

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