/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

const SearchFriend = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [friendToSearch, setFriendToSearch] = useState('');
  const [warnMessage, setWarnMessage] = useState('');
  // const [value, setValue] = useState('');

  const [users, setUsers] = useState([]);
  const getUsers = () => {
    axios.get('/findUsers').then(({ data }) => {
      setUsers(data.map((user) => user.name));
    });
  };

  const friendSearchOnChange = (event) => {
    setShowSuggestions(true);
    const { value } = event.target;

    let sortedSuggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, 'i');
      sortedSuggestions = users.sort().filter((v) => regex.test(v));
    }
    setSuggestions(sortedSuggestions);
    setFriendToSearch(value);
  };

  const sendFriendRequest = () => {
    document.getElementById('friendInput').value = '';
    setFriendToSearch('');
    setShowSuggestions(false);
    axios.get('/session').then(({ data }) => {
      axios
        .get(`/findFriend/${friendToSearch}/${data.name}`)
        .then(({ data }) => {
          setWarnMessage(data);
          setTimeout(() => setWarnMessage(''), 2000);
        })
        .catch((err) => console.info(err));
    });
  };

  const onFocus = (event) => {
    if (event.target.autocomplete) {
      event.target.autocomplete = 'off';
    }
  };

  useEffect(() => getUsers(), []);

  return (
    <div>
      {warnMessage ? <div id="warnMessage">{warnMessage}</div> : null}
      <Combobox className="combobox">
        <ComboboxInput
          onChange={friendSearchOnChange}
          placeholder="Find A Pup Bud!"
          autoComplete="off"
          onFocus={onFocus}
          id="friendInput"
        />
        <input
          id="searchFriend"
          type="button"
          value="Add Friend!"
          onClick={sendFriendRequest}
        />
        <ComboboxPopover>
          <ComboboxList>
            {showSuggestions
              ? suggestions.map((suggestion) => (
                <ComboboxOption
                  value={suggestion}
                  onClick={() => {
                    setFriendToSearch(suggestion);
                  }}
                />
              ))
              : null}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

export default SearchFriend;
