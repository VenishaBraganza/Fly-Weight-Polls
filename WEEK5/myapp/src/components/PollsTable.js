import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TagsContext } from "../TagsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: "1px solid #ddd",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: "1px solid #ddd",
}));

const PollsTable = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const { selectedTags } = useContext(TagsContext);

  useEffect(() => {
    fetchPolls();
  }, [selectedTags]);

  const fetchPolls = async () => {
    try {
      let url = "http://127.0.0.1:8000/polls/polls/";
      if (selectedTags.length > 0) {
        url += `?tags=${selectedTags.join(",")}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPolls(data.data);
      setLoading(false);

      // Delete empty poll questions
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleQuestionClick = (id) => {
    navigate(`/poll-detail?id=${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Number</StyledTableCell>
                <StyledTableCell>Poll Question</StyledTableCell>
                <StyledTableCell>Total Votes</StyledTableCell>
                <StyledTableCell>Tags</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {polls
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((poll, index) => (
                  <StyledTableRow key={poll.QuestionID}>
                    <StyledTableCell>{poll.QuestionID}</StyledTableCell>
                    <StyledTableCell>
                      <span
                        onClick={() => handleQuestionClick(poll.QuestionID)}
                        style={{ color: "black", cursor: "pointer" }}
                      >
                        {poll.Question}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>
                      {Object.values(poll.OptionVote).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{poll.Tags.join(", ")}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={polls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default PollsTable;
