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
  // const [calendar, setCalendar] = useState('');
  const [events, setEvents] = useState([]);
  // const [email, setEmail] = useState('');
  // const [date, setDate] = useState(new Date());
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
    console.info(ApiCalendar);
    if (ApiCalendar.sign) {
      console.info('worked');
      setSign(true);
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

  // const updateSign = () => console.info('listened');

  ApiCalendar.onLoad(() => {
    console.info('loaded');
    // getEvents();
  });

  const signInOrOut = (name) => {
    // console.info(ApiCalendar);
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick();
      console.info('signed in');
      // while (!sign) {
      //   getEvents();
      // }
      // setSign(true);
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
  };

  // const onChange = () => {
  //   ApiCalendar.listenSign(getEvents);
  // };

  // const getUserEmail = () => {
  //   if (!email) {
  //     // console.log('getting email');
  //     axios.get('/session')
  //       .then(({ data }) => setEmail(data.email))
  //       .catch();
  //   }
  // };

  // const getCalendar = () => {
  //   axios.get(`https://www.googleapis.com/calendar/v3/calendars/${email}`,
  //     {
  //       params: {
  //         Authorization: process.env.GOOGLE_MAPS_KEY,
  //       },
  //     })
  //     .then((result) => console.info(result))
  //     .catch();
  // };

  useEffect(() => signInOrOut('sign-in'), []);

  return (
    <div className="Profile">
      <Navbar />
      <Sidebar />
      <div className="calendar">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <button
        className="google-calendar"
        type="button"
        onClick={() => {
          getEvents();
        }}
      >
        {sign.toString()}
      </button>
      {/* {onChange()} */}
    </div>
  );
};

export default CalendarView;
