import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const HERE_API_KEY = "bkcSPRdVvTDIeFZ1-yWPgHw4CHlCFcCrbYIYlNAACCE";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

interface Suggestion {
  id: string;
  title: string;
  address: {
    street?: string;
    district?: string;
    city?: string;
    county?: string;
  };
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  icon,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://autocomplete.search.hereapi.com/v1/autocomplete",
        {
          params: {
            q: searchQuery, // No need to append ", Bangalore"
            apiKey: HERE_API_KEY,
            limit: 5,
            at: "12.9716,77.5946", // Bangalore coordinates
            lang: "en",
          },
        }
      );

      console.log("API Response:", response.data);

      setSuggestions(response.data.items || []);
    } catch (error: any) {
      console.error(
        "Error fetching location suggestions:",
        error.response?.data || error.message
      );
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the fetch function to prevent too many API calls
  const debouncedFetch = useCallback(
    debounce((searchQuery: string) => fetchSuggestions(searchQuery), 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    debouncedFetch(newQuery);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const locationName = suggestion.title;
    setQuery(locationName);
    onChange(locationName);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (query.length >= 2) {
      debouncedFetch(query);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-gray-500">{icon}</div>}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            icon ? "pl-12" : "pl-4"
          }`}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            >
              <div className="font-medium">{suggestion.title}</div>
              {(suggestion.address.street || suggestion.address.district) && (
                <div className="text-xs text-gray-500">
                  {suggestion.address.street && `${suggestion.address.street}, `}
                  {suggestion.address.district || suggestion.address.city}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
