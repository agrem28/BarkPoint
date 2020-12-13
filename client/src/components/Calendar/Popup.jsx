import React from 'react';
import PropTypes from 'prop-types';
import './Calendar.css';

const Popup = ({ event, setShowPopup }) => (
  <div className="calendar-popup">
    <div id="popup-title">{event.title}</div>
    <div id="popup-time">
      {`${event.start.toDateString()} * ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
    </div>
    <div id="popup-location">
      {event.location}
    </div>
    <div id="guest-count">
      {`${event.attendees.length} guest${event.attendees.length > 1 ? 's' : ''}`}
    </div>
    <div>
      {event.attendees.map((attendee) => (
        <div key={attendee} className="guestList">
          {attendee.email}
        </div>
      ))}
    </div>
    <button id="close" onClick={() => setShowPopup(false)}>X</button>
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
