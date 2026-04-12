import React from "react";

const FiltersSidebar = ({ filters, setFilters }) => {
  return (
    <div style={styles.sidebar}>
      <h3>Filters</h3>

      <label>Job Type</label>
      <select
        onChange={(e) =>
          setFilters({ ...filters, type: e.target.value })
        }
      >
        <option value="">All</option>
        <option>Full-time</option>
        <option>Internship</option>
      </select>

      <label>Location</label>
      <input
        placeholder="Enter location"
        onChange={(e) =>
          setFilters({ ...filters, location: e.target.value })
        }
      />

      <label>Salary</label>
      <input
        placeholder="Min salary"
        onChange={(e) =>
          setFilters({ ...filters, salary: e.target.value })
        }
      />
    </div>
  );
};

export default FiltersSidebar;

const styles = {
  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};