import React, { useState, useEffect } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
// import axios from 'axios';

import Navbar from '../Navbar/Navbar';
import Sidebar from '../ProfileAndToys/Sidebar';

import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [sign, setSign] = useState(ApiCalendar.sign);

  // const testEvent = {
  //   summary: 'Test Event',
  //   start: {
  //     dateTime: new Date(2020, 11, 10, 15),
  //   },
  //   end: {
  //     dateTime: new Date(2020, 11, 10, 17),
  //   },
  // };

  // const createEvent = () => {
  //   console.info(testEvent);
  //   ApiCalendar.createEvent(testEvent)
  //     .then(({ result }) => result)
  //     .then(({ htmlLink }) => setCalendar(htmlLink))
  //     .catch((err) => console.warn(err));
  // };

  const getEvents = () => {
    if (ApiCalendar.sign) {
      ApiCalendar.listUpcomingEvents()
        .then(({ result }) => {
          console.info(result.items);
          setEvents(result.items.map((event) => ({
            title: event.summary,
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
          })));
        }).catch();
    } else {
      console.info("didn't work");
    }
  };

  const signInOrOut = (name) => {
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick();
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
    setSign(ApiCalendar.sign);
  };

  useEffect(() => getEvents(), [sign]);

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      {sign ? (
        <button
          className="google-calendar"
          type="button"
          onClick={() => signInOrOut('sign-out')}
        >
          Unlink Calendar
        </button>
      ) : (
        <button
          className="google-calendar"
          type="button"
          onClick={() => signInOrOut('sign-in')}
        >
          Link with Your Google Calendar
        </button>
      )}
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      {/* <button
        className="google-calendar"
        type="button"
        onClick={() => getEvents()}
      >
        {sign.toString()}
      </button> */}
    </div>
  );
};

export default CalendarView;
