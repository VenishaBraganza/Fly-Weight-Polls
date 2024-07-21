import React from "react";
import { Link } from "react-router-dom";

const CreatePollBtn = () => {
  return (
    <Link to="/create-poll" style={{ textDecoration: "none" }}>
      <button className="create-poll-btn">Create Poll</button>
    </Link>
  );
};

export default CreatePollBtn;
