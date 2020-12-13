import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import './Calendar.css';

const Popup = ({ event, setShowPopup }) => (
  <Typography className="calendar-popup">
    <div id="popup-title">{event.title}</div>
    <div id="popup-time">
      {`${event.start.toDateString()} * ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
    </div>
    <div>
      <div id="popup-location">
        <LocationOnOutlinedIcon color="action" />
        {`   ${event.location}`}
      </div>
    </div>
    <div id="guest-count">
      <PeopleAltOutlinedIcon color="action" />
      {`   ${event.attendees.length} guest${event.attendees.length > 1 ? 's' : ''}`}
    </div>
    <div>
      {event.attendees.map((attendee) => (
        <div key={attendee} className="guestList">
          {attendee.email}
        </div>
      ))}
    </div>
    {/* <Button id="close" onClick={() => setShowPopup(false)}>X</Button> */}
    <CloseIcon id="close" onClick={() => setShowPopup(false)} />
  </Typography>
);

Popup.propTypes = {
  // setEventLocation: PropTypes.func.isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    attendees: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string.isRequired,
      responseStatus: PropTypes.string.isRequired,
    })).isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
  setShowPopup: PropTypes.bool.isRequired,
};

export default Popup;
