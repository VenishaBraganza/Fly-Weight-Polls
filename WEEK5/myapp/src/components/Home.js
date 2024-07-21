import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import PollsTable from "./PollsTable";
import { Box, useMediaQuery, useTheme, LinearProgress } from "@mui/material";

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust this value as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box className="app-container">
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "left",
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              width: isMobile ? "100%" : "75%",
              transition: "width 0.3s ease-in-out",
            }}
          >
            <LinearProgress sx={{ width: "100%", height: 5 }} />
          </Box>
        </Box>
      )}
      <Box className={`main-content ${isMobile ? "mobile" : ""}`}>
        <Box className="sidebar">
          <Sidebar />
        </Box>
        <Box className="poll-table">
          <PollsTable />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
