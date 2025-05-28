import { useState, useEffect, useRef } from "react";
import { suggestions } from "../data/dummyData";
import { LRUCache } from "../utils/LRUCache";

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
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query) return setResults([]);

    debounceRef.current = setTimeout(() => {
      const cached = cache.get(query);
      if (cached) {
        setResults(cached);
      } else {
        const filtered = suggestions.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        cache.set(query, filtered);
        setResults(filtered);
      }
    }, 300);
  }, [query]);

  return (
    <div className="flex flex-col items-center mt-20">
      <input
        type="text"
        className="border p-2 w-96 rounded"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <div className="border w-96 mt-2 rounded shadow">
          {results.map((item) => (
            <div key={item.id} className="p-2 hover:bg-gray-100">
              {highlightMatch(item.name, query)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}