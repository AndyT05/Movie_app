import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search movies"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <p>{searchTerm}</p>
      </div>
    </div>
  );
};

export default Search;
