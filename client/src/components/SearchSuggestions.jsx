import React, { useState, useEffect, useRef } from 'react';
import { jobAPI } from '../services/api';
import '../styles/SearchSuggestions.css';

const SearchSuggestions = ({ onSelect, type = 'all' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ titles: [], locations: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Debounce the search query
  useEffect(() => {
    clearTimeout(debounceTimer.current);

    if (!query.trim()) {
      setSuggestions({ titles: [], locations: [] });
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await jobAPI.getSearchSuggestions(query);
        setSuggestions(response.data.data);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions({ titles: [], locations: [] });
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  const handleSelectSuggestion = (value, suggestionType) => {
    setQuery(value);
    setIsOpen(false);
    onSelect(value, suggestionType);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.trim() && suggestions.titles.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  const displayedSuggestions = [];

  // Add title suggestions based on type filter
  if (type === 'all' || type === 'title') {
    suggestions.titles.forEach((title) => {
      displayedSuggestions.push({
        value: title,
        label: `💼 ${title}`,
        type: 'title',
      });
    });
  }

  // Add location suggestions based on type filter
  if (type === 'all' || type === 'location') {
    suggestions.locations.forEach((location) => {
      displayedSuggestions.push({
        value: location,
        label: `📍 ${location}`,
        type: 'location',
      });
    });
  }

  return (
    <div className="search-suggestions-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleClickOutside}
        placeholder="Search jobs or locations..."
        className="search-input"
        autoComplete="off"
      />

      {loading && <div className="suggestions-loading">⏳ Loading...</div>}

      {isOpen && displayedSuggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {displayedSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${index}`}
              className="suggestion-item"
              onMouseDown={() =>
                handleSelectSuggestion(suggestion.value, suggestion.type)
              }
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && !loading && displayedSuggestions.length === 0 && query.trim() && (
        <div className="suggestions-empty">No suggestions found</div>
      )}
    </div>
  );
};

export default SearchSuggestions;
