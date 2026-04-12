const JobCard = ({ job }) => {
  return (
    <div style={styles.card}>
      <img src={job.logo} style={{ width: "40px" }} />

      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>

      <button>Apply</button>
    </div>
  );
};

export default JobCard;

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "0.3s",
  },
};