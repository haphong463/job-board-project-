import React, { useEffect } from "react";
import Autosuggest from "react-autosuggest";
import { useDispatch, useSelector } from "react-redux";
import { fetchHashtags } from "../../features/blogSlice";
import "./style.css";
const HashtagAutocomplete = ({ searchText, setSearchText }) => {
  const dispatch = useDispatch();
  const hashtags = useSelector((state) => state.blogs.hashtags);

  useEffect(() => {
    dispatch(fetchHashtags());
  }, [dispatch]);

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const allSuggestions =
      inputLength === 0
        ? []
        : hashtags.filter((hashtag) =>
            hashtag.name.toLowerCase().includes(inputValue)
          );
    // Limit the number of suggestions to 10
    return allSuggestions.slice(0, 5);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setSearchText(newValue);
  };

  const [suggestions, setSuggestions] = React.useState([]);

  const inputProps = {
    placeholder: "Enter keyword to search...",
    value: searchText,
    onChange: onChange,
    className: "form-control form-control-lg col-lg-8 col-md-6 col-sm-12",
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

export default HashtagAutocomplete;
