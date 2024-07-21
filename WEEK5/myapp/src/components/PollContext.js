import React, { createContext, useState, useContext } from "react";

const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);

  return (
    <PollContext.Provider
      value={{ selectedTags, setSelectedTags, filteredPolls, setFilteredPolls }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePollContext = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error("usePollContext must be used within a PollProvider");
  }
  return context;
};
