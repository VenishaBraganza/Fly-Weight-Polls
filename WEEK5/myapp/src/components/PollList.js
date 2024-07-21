import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import { TagContext } from "./TagContext";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls/");
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const handleFilterPolls = (polls, selectedTags) => {
    // Filter the polls based on the selected tags
    const filteredPolls = polls.filter((poll) =>
      poll.tags.some((tag) => selectedTags.includes(tag.name))
    );
    // Update the state with the filtered polls or perform further actions
    console.log("Filtered polls:", filteredPolls);
  };

  return (
    <TagContext.Provider value={{ selectedTags, setSelectedTags }}>
      <Filter handleFilterPolls={handleFilterPolls} polls={polls} />
      {/* Render the poll list or other components */}
    </TagContext.Provider>
  );
};

export default PollList;
