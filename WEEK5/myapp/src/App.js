import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Home from "./components/Home";
import Heading from "./Heading";
import "./App.css";
import { TagsProvider } from "./TagsContext";

const PollDetail = lazy(() => import("./components2/PollDetail"));
const Vote = lazy(() => import("./components3/Vote"));
const CreatePoll = lazy(() => import("./components4/CreatePoll"));
const ResultsPage = lazy(() => import("./ResultsPage"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating component loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust delay time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <TagsProvider>
        <div className="app-container">
          <Heading />
          {isLoading ? (
            <LinearProgress />
          ) : (
            <Suspense fallback={<LinearProgress />}>
              <Routes>
                <Route path="/poll-detail" element={<PollDetail />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/create-poll" element={<CreatePoll />} />
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<ResultsPage />} />
              </Routes>
            </Suspense>
          )}
        </div>
      </TagsProvider>
    </Router>
  );
}

export default App;
