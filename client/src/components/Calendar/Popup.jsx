import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import './Calendar.css';

const Popup = ({ event, setShowPopup }) => (
  <div className="calendar-popup">
    <Typography id="popup-title">{event.title}</Typography>
    <Typography id="popup-time">
      {`${event.start.toDateString()} * ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
    </Typography>
    <div>
      <Typography id="popup-location">
        <LocationOnOutlinedIcon color="action" />
        {`   ${event.location}`}
      </Typography>
    </div>
    <Typography id="guest-count">
      <PeopleAltOutlinedIcon color="action" />
      {`   ${event.attendees.length} guest${event.attendees.length > 1 ? 's' : ''}`}
    </Typography>
    <Typography>
      {event.attendees.map((attendee) => (
        <Typography key={attendee} className="guestList">
          {attendee.email}
        </Typography>
      ))}
    </Typography>
    {/* <Button id="close" onClick={() => setShowPopup(false)}>X</Button> */}
    <CloseIcon id="close" onClick={() => setShowPopup(false)} />
  </div>
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
