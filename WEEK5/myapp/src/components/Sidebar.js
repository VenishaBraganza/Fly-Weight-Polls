import React from "react";
import Filter from "./Filter";
import CreatePollBtn from "./CreatePollBtn";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div>
        <CreatePollBtn />
      </div>
      <Filter />
    </div>
  );
};

export default Sidebar;
