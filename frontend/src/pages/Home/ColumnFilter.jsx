// Provides logical && searching and works in conjunction with global filter
import { useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// Icon is SVG not CSS: styled component allows icon in placeholder
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
        padding-top: 0.9rem;
        padding-bottom: 0.9rem;
    }

    & .filter-icon {
        color: var(--secondary-light); 
        margin-right: 0.312rem;
        transition: color 0.3s, transform 0.3s; 
        font-size: 1.5rem;
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
`;
const filterIcon = (
  <FontAwesomeIcon icon={faFilter} className="filter-icon" />
);

const ColumnFilter = ({ column }) => {
  // console.log(column)
  useEffect(() => {
    console.log("Component updated");
  }, []);
  const { filterValue, setFilter, Header } = column;

  // Hide input in date columns (DateRangeFilter used instead or no filter)
  if (
    column.Header !== "Created On" &&
    column.Header !== "Updated On" &&
    column.Header !== "Delete"
  ) {
    /* Accessibility - any input placeholder is announced 
    for every table body cell, creates user disorientation */
    return (
      <section> 
        <SearchBox>
          {filterIcon}
          <input
            type="text"
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value)}
            aria-label={`${Header.toLowerCase()}`}
          />
        </SearchBox>
      </section>
    );
  } else {
    return null;
  }
};

export default ColumnFilter;