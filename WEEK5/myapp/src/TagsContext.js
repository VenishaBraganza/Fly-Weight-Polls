import React, { createContext, useState } from "react";

export const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <TagsContext.Provider value={{ selectedTags, setSelectedTags }}>
      {children}
    </TagsContext.Provider>
  );
};
