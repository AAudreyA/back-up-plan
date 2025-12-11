import React, { useState } from "react";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function search() {
    try {
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const res = await fetch(`${proxy}https://api.deezer.com/search?q=${query}`);
    
        if (!res.ok) {
          console.error("API error:", res.status);
          return;
        }
    
        const json = await res.json();
    
        if (!json || !json.data) {
          console.error("Invalid API response:", json);
          return;
        }
    
        setResults(json.data);
      } catch (err) {
        console.error("Search failed:", err);
      }
  }

  return (
    <div className="search-container flow-circular-regular">
      <input
        placeholder="Search songs"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="btn" onClick={search}>Search</button>

      <ul className="results-list">
        {results.map(song => (
          <li key={song.id} onClick={() => onSelect(song)}>
            {song.title} – {song.artist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
