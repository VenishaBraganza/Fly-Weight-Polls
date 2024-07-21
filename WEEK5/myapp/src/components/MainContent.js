import React from "react";
import { Box } from "@mui/material";
import PollsTable from "./PollsTable";

const MainContent = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <PollsTable />
    </Box>
  );
};

export default MainContent;
