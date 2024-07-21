import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { Chart } from "react-google-charts";
import "./PollDetail.css";

const PollDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = new URLSearchParams(location.search);
  const pollId = searchParams.get("id");

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/polls/polls/${pollId}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPoll(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [pollId]);

  if (error) return <div>Error: {error.message}</div>;

  const handleVote = () => {
    navigate(`/vote?id=${pollId}`, { state: { poll } });
  };

  const columns = [
    { field: "id", headerName: "Number", width: isMobile ? 50 : 70 },
    { field: "option", headerName: "Option", flex: 1 },
    { field: "votes", headerName: "Votes", width: isMobile ? 70 : 100 },
  ];

  const rows = poll
    ? Object.entries(poll.OptionVote).map(([option, votes], index) => ({
        id: index + 1,
        option,
        votes,
      }))
    : [];

  const pieData = poll
    ? [
        ["Option", "Votes"],
        ...Object.entries(poll.OptionVote).map(([option, votes]) => [
          option,
          votes,
        ]),
      ]
    : [];

  const pieOptions = {
    pieHole: 0.4,
    is3D: false,
  };

  return (
    <Box className="poll-detail-container">
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

      {!loading && poll && (
        <>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h2"
            gutterBottom
            className="poll-question"
          >
            {poll.Question}
          </Typography>
          <Button
            variant="contained"
            onClick={handleVote}
            className="vote-button"
            sx={{ mb: 2 }}
            fullWidth
            disabled={loading}
          >
            Vote on this Poll
          </Button>

          <Box className="poll-content">
            <Box
              sx={{
                height: isMobile ? 200 : 250,
                width: isMobile ? "100%" : "60%",
                mb: isMobile ? 2 : 0,
              }}
              className="poll-table-container"
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={2}
                rowsPerPageOptions={[2, 5, 10]}
                disableSelectionOnClick
                sx={{
                  boxShadow: 2,
                  border: 2,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: isMobile ? "0.8rem" : "inherit",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                height: isMobile ? 200 : 250,
                width: isMobile ? "100%" : "40%",
              }}
              className="poll-chart-container"
            >
              <Typography variant="h6" className="poll-representation-title">
                Poll Representation
              </Typography>
              <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={pieData}
                options={pieOptions}
              />
            </Box>
          </Box>

          <Typography variant="body2" className="poll-tags">
            Tags: {poll.Tags.join(", ")}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default PollDetail;
