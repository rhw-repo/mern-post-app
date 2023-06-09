// multiple terms, finds match(es) in the 1st applicable column. 
import { useState } from "react";
import { useAsyncDebounce } from "react-table";

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
                <input
                    type="text"
                    placeholder="Search across all the rows & columns..."
                    value={value || ""}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange(e.target.value)
                    }}
                />
            </span>
        </div>
    )
}

export default GlobalFilter;