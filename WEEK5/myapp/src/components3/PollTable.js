import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  LinearProgress,
  Backdrop,
} from "@mui/material";
import "./Vote.css";

const Vote = () => {
  const [searchParams] = useSearchParams();
  const pollId = searchParams.get("id");
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const cookieValue = document.cookie.match(
      `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
    );
    return cookieValue ? cookieValue.pop() : "";
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/polls/polls/${pollId}/`)
      .then((response) => response.json())
      .then((data) => {
        setPoll(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching poll data:", error);
        setLoading(false);
      });
  }, [pollId]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = () => {
    if (selectedOption) {
      setIsSubmitting(true);
      const requestBody = { incrementOption: selectedOption };

      const csrfToken = getCookie("csrftoken");

      fetch(`http://127.0.0.1:8000/polls/${pollId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error || "Invalid request method");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            navigate("/");
          } else {
            alert(data.msg);
            setIsSubmitting(false);
          }
        })
        .catch((error) => {
          console.error("Error submitting vote:", error);
          alert("Error submitting vote. Please try again.");
          setIsSubmitting(false);
        });
    } else {
      alert("Please select an option to vote.");
    }
  };

  return (
    <Box className="vote-container">
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {isSubmitting && (
        <Backdrop open={true} style={{ zIndex: 9999, color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {!loading && poll && (
        <>
          <Typography variant="h5" component="h2" className="poll-question">
            {poll.Question}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="poll options"
              name="poll-options"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {Object.keys(poll.OptionVote).map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  className="option-container"
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVote}
              className="vote-button"
              disabled={isSubmitting || loading}
              fullWidth
            >
              Vote
            </Button>
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default Vote;
