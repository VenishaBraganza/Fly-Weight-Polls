import React from "react";
import CreatePollBtn from "./CreatePollBtn";
import Filter from "./Filter";

const Sidebar = () => {
  return (
    <div>
      <CreatePollBtn />
      <Filter />
    </div>
  );
};

export default Sidebar;
