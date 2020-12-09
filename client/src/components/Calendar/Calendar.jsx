/* eslint-disable no-console */
import React, { useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import axios from 'axios';

import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';

const Calendar = () => {
  // const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');

  const calendarStyle = {
    position: 'relative',
    left: '16vw',
    border: 0,
    width: 800,
    height: 600,
    frameBorder: '0',
    scrolling: 'no',
  };

  const style = {
    position: 'relative',
    left: '16vw',
    border: 0,
  };
  const handleItemClick = (e, name) => {
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
  };

  const getUserEmail = () => {
    if (!email) {
      console.log('getting email');
      axios.get('/session')
        .then(({ data }) => setEmail(data.email))
        .catch();
    }
  };

  const getCalendar = () => {
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/${email}`,
      {
        params: {
          Authorization: process.env.GOOGLE_MAPS_KEY,
        },
      })
      .then((result) => console.log(result))
      .catch();
  };

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      {getUserEmail()}
      <iframe
        title="unique"
        src="https://calendar.google.com/calendar/embed?src=tgp714lsis8vj69mijims7052c%40group.calendar.google.com&ctz=America%2FChicago"
        style={calendarStyle}
      />
      <button
        style={style}
        type="button"
        onClick={(e) => handleItemClick(e, 'sign-in')}
      >
        sign-in
      </button>
      <button
        style={style}
        type="button"
        onClick={(e) => handleItemClick(e, 'sign-out')}
      >
        sign-out
      </button>
      <button
        style={style}
        type="button"
        onClick={getCalendar}
      >
        get calendar
      </button>
    </div>
  );
};

export default Calendar;
