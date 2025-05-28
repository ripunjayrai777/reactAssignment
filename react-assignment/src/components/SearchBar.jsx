import { useState, useEffect, useRef } from "react";
import { suggestions } from "../data/dummyData";
import { LRUCache } from "../utils/LRUCache";
import "./searchbar.css";

const cache = new LRUCache();

const highlightMatch = (text, query) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <span>
      {text.substring(0, index)}
      <b>{text.substring(index, index + query.length)}</b>
      {text.substring(index + query.length)}
    </span>
  );
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();
      const cached = cache.get(normalizedQuery);
      if (cached) {
        setResults(cached);
      } else {
        const filtered = suggestions.filter((item) =>
          item.name.toLowerCase().includes(normalizedQuery)
        );
        cache.set(normalizedQuery, filtered);
        setResults(filtered);
      }
      setShowDropdown(true);
    }, 300);
  }, [query]);

  
  const handleItemClick = (name) => {
    setQuery(name);   
    setShowDropdown(false); 
    setResults([]);      
  };

  return (
    <div className="searchbar-container">
      <div ref={inputRef} className="searchbar-input-wrapper">
        <input
          type="text"
          className="searchbar-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
        />
        {showDropdown && results.length > 0 && (
          <div className="searchbar-dropdown">
            {results.map((item) => (
              <div
                key={item.id}
                className="searchbar-item"
                onClick={() => handleItemClick(item.name)}
              >
                {highlightMatch(item.name, query)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
