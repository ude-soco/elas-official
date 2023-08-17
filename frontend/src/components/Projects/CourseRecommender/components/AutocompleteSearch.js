/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import {TextField,InputAdornment,Grid} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from "@material-ui/icons/Search";

import Backend from '../../../../assets/functions/Backend';

function unique(arr) { //make elements in array are unique 
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array;
}

const AutocompleteSearch = ({selectedKeywords, setSelectedKeywords}) => {
    let [input, setInput] = useState("");
    let [results, setResults] = useState({});
    let [suggestions, setSuggestions] = useState([]);

    const inputHandler = (e) => {
        e.preventDefault();
        setInput(e.target.value);
        
    };

    useEffect(()=>{
        let interval;
        if (input.length >= 2){
            interval = setTimeout(()=>{
                Backend.get("/searching", {
                    params: { typing_text: input },
                }).then((response) => {
                    setResults(response.data);
                    console.log(response.data); 
                });
            },1000);
        }
        return () => clearTimeout(interval)
    },[input]);

    useEffect(()=>{
        let suggestionList = [];
        // console.log(results.relevant_keywords);
        for (let i in results.extracted_keywords) {
            var obj1={}; 
            suggestionList.push(obj1.name=results.extracted_keywords[i]);
        }
        for (let i in results.relevant_keywords) {
            var obj2={}; 
            suggestionList.push(obj2.name=results.relevant_keywords[i]);
        }
        for (let i in results.category) {
            var obj3={}; 
            suggestionList.push(obj3.name=results.category[i]);
        }
        setSuggestions(unique(suggestionList));
    },[results]);


    // console.log(suggestions);
    
    return (
        <div style={{ width: "100%" }}>
            <Autocomplete
                id="autocomplete"
                freeSolo
                // disableCloseOnSelect
                disableClearable
                options={suggestions}
                // getOptionLabel={}
                noOptionsText={"No suggestions found..."}

                renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                          )
                        }}
                        label="Interests searching" margin="normal" variant="outlined" 
                        onChange={inputHandler}
                        style={{ backgroundColor: "#fff" }}
                      />
                    );
                  }}

                value={selectedKeywords.name}
                onChange={(event,newKeyword)=>{
                    if (selectedKeywords.findIndex((item)=>item.name===newKeyword) === -1) {
                        var key = {};
                        key.name = newKeyword;
                        key.value = 3;
                        setSelectedKeywords([...selectedKeywords, key]);
                    }
                    
                }}
            />
            
        </div>
    );
}

export default AutocompleteSearch;
