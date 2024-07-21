import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Heading = () => {
  return (
    <div className="header">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1> FlyWeight Polls</h1>
      </Link>
    </div>
  );
};

export default Heading;
