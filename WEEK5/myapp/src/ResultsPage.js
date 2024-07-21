import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const { requestBody } = location.state || {};

  if (!requestBody) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Vote Request Body</h1>
      <pre>{JSON.stringify(requestBody, null, 2)}</pre>
    </div>
  );
};

export default ResultsPage;
