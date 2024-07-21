import React from "react";
import { Box } from "@mui/material";
import PollTable from "./PollTable"; // Assuming PollTable component is where DataGrid will be added

const MainContent = () => {
  return (
    <Box>
      <PollTable />
    </Box>
  );
};

export default MainContent;
