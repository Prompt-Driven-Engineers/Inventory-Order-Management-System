import React, {useState} from 'react';
import Autosuggest from 'react-autosuggest';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function SearchBar({}) {
    const [searchedProduct, setSearchedProduct] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const fetchSuggestions = async (value) => {
        axios.get(`http://localhost:8000/products/search?keyword=${value}`)
            .then(response => setSuggestions(response.data))
            .catch(err => console.error("Error fetching products:", err));
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        if (value.trim().length > 0) {
            fetchSuggestions(value);
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.Name;

    const renderSuggestion = (suggestion) => (
        <div className="p-2 hover:bg-gray-100 cursor-pointer">
            {suggestion.Name} - <span className="text-sm text-gray-500">{suggestion.Brand}</span>
        </div>
    );

    const onSuggestionSelected = async (event, { suggestion }) => {
        // console.log(searchedProduct);
        if(searchedProduct) {
            navigate(`/find/${suggestion.Name}`);
        }
        // setSearchedProduct(suggestion.Name);
        // if (onProductSelect) {
        //     onProductSelect(suggestion);
        // }
    };

    const inputProps = {
        placeholder: "Search for Products, Brands, or More",
        value: searchedProduct,
        onChange: (e, { newValue }) => setSearchedProduct(newValue),
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            if(searchedProduct) {
                navigate(`/find/${searchedProduct}`);
            }
          }
        },
        className:
          "w-full rounded-lg p-2 font-medium bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600"
    };
    return (
        <div className="relative w-full">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={onSuggestionSelected}
            />
        </div>
    )
}
