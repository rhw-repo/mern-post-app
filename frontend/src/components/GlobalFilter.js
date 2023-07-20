// multiple terms, finds match(es) in the 1st applicable column. 
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

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

const GlobalFilter = ({ filter, setFilter }) => {
    const [value, setValue] = useState(filter)

    // Delays filter execution preventing unnecessary operations, better performance
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 300)

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
                width: "60%"
            }}>
                <SearchBox>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        placeholder="Search across all the rows & columns..."
                        value={value || ""}
                        onChange={(e) => {
                            setValue(e.target.value)
                            onChange(e.target.value)
                        }}
                    />
                </SearchBox>
            </span>
        </div>
    )
}

export default GlobalFilter;