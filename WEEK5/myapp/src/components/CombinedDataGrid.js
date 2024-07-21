import React, { useState, useEffect, useContext } from "react";
import { TagsContext } from "../TagsContext";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "filter", headerName: "Filter Options", width: 200 },
  { field: "id", headerName: "Number", width: 100 },
  { field: "question", headerName: "Poll Question", width: 250 },
  { field: "votes", headerName: "Total Votes", width: 150 },
  { field: "tags", headerName: "Tags", width: 200 },
];

const CombinedDataGrid = () => {
  const [rows, setRows] = useState([]);
  const { selectedTags } = useContext(TagsContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedTags]);

  const fetchData = async () => {
    try {
      const filterResponse = await fetch(
        "http://127.0.0.1:8000/polls/filters/"
      );
      const filterData = await filterResponse.json();

      let pollUrl = "http://127.0.0.1:8000/polls/polls/";
      if (selectedTags.length > 0) {
        pollUrl += `?tags=${selectedTags.join(",")}`;
      }
      const pollResponse = await fetch(pollUrl);
      const pollData = await pollResponse.json();

      const combinedData = filterData.data.map((filter, index) => ({
        id: pollData.data[index]?.QuestionID || index,
        filter: filter.name,
        question: pollData.data[index]?.Question || "",
        votes: pollData.data[index]
          ? Object.values(pollData.data[index].OptionVote).reduce(
              (a, b) => a + b,
              0
            )
          : 0,
        tags: pollData.data[index]?.Tags.join(", ") || "",
      }));

      setRows(combinedData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleQuestionClick = (id) => {
    navigate(`/poll-detail?id=${id}`);
  };

  return (
    <Box sx={{ width: "100%", height: "400px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        onCellClick={(params) => {
          if (params.field === "question" && params.row.id) {
            handleQuestionClick(params.row.id);
          }
        }}
      />
    </Box>
  );
};

export default CombinedDataGrid;
