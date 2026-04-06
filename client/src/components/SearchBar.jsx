import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from './SearchSuggestions';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value, type) => {
    setSearchQuery(value);
    
    // Redirect to job listings with search filter
    if (type === 'title') {
      navigate(`/jobs?title=${encodeURIComponent(value)}`);
    } else if (type === 'location') {
      navigate(`/jobs?location=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="search-bar">
      <SearchSuggestions onSelect={handleSearch} type="all" />
    </div>
  );
};

export default SearchBar;
