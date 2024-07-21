import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const CreatePollBtn = () => {
  return (
    <div>
      <Button
        component={Link}
        to="/create-poll"
        variant="contained"
        color="primary"
      >
        Vote on this poll
      </Button>
    </div>
  );
};

export default CreatePollBtn;
