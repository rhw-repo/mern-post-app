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
    box-shadow: 
    0rem 0.125rem 0.25rem 0rem rgba(0, 0, 0, 0.2),
    0rem 0.25rem 0.3125rem 0rem rgba(0, 0, 0, 0.14),
    0rem 0.0625rem 0.625rem 0rem rgba(0, 0, 0, 0.12),
    0.3125rem 0.3125rem 0.3125rem 0.3125rem #778DA5;
    margin: 0.312rem auto;
    padding: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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

    const filterIcon = <FontAwesomeIcon icon={faFilter} />

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
                        placeholder="Search all the table..."
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