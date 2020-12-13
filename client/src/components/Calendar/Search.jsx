import React from 'react';
import PropTypes from 'prop-types';
import usePlacesAutoComplete from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import './Calendar.css';

const Search = ({ setEventLocation }) => {
  const {
    value, suggestions: { status, data }, setValue, clearSuggestions,
  } = usePlacesAutoComplete({
    requestOptions: {
      location: { lat: () => 29.951065, lng: () => -90.071533 },
      radius: 200 * 1000,
    },
  });

  return (
  // combox is used to store suggestions from function above it
  // is the set the address chosen and converted into geocode from getGeoCode

  // combox Input will change on type and once enter is pressed
  // data will be iterated through and displayed in combolist
    <div className="event-location">
      <Combobox
        // onSelect={async (address) => {
        //   setValue(address, false);
        //   clearSuggestions();
        //   const results = await getGeocode({ address });
        //   const { lat, lng } = await getLatLng(results[0]);
        //   panTo({ lat, lng });
        //   setValue('');
        // }}
        onSelect={(address) => {
          setValue(address, false);
          setEventLocation(address);
          clearSuggestions();
          setValue('');
        }}
      >
        <ComboboxInput value={value} onChange={(e) => setValue(e.target.value)} placeholder="Where are you going?" />
        <ComboboxPopover>
          <ComboboxList>

            { status === 'OK' && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />) }
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

Search.propTypes = {
  setEventLocation: PropTypes.func.isRequired,
};

export default Search;
