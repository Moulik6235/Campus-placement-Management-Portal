const SearchBar = ({ setSearch }) => {
  return (
    <div style={styles.box}>
      <input
        placeholder="Search jobs (React, Java...)"
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />
    </div>
  );
};

export default SearchBar;

const styles = {
  box: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};