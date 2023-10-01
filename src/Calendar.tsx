import React, { useEffect, useRef, useState } from "react";
import { EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { css } from "@emotion/react";
import axios from "axios";
import AddModal from "./components/AddModal";

import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

interface CalendarAppState {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
  holidays: IHoliday[];
}

interface IHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[];
  launchYear: number;
  types: string[];
  start: string;
  title: string;
}

const Calendar: React.FC = () => {
  const modalShow = useRef(false);

  const [state, setState] = useState<CalendarAppState>({
    weekendsVisible: true,
    currentEvents: [],
    holidays: [],
  });

  const [title, setTitle] = useState('');

  const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setTitle(event.target.value);
  }

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          "https://date.nager.at/api/v3/PublicHolidays/2023/us"
        );
        const holidays = response.data;

        const holidaysWithDisplay = holidays.map((holiday: any) => ({
          start: holiday.date,
          display: "background", // Додайте параметр display: 'background'
          title: holiday.localName,
        }));

        // Додайте вихідні дні до вашого стану
        setState({
          weekendsVisible: state.weekendsVisible,
          currentEvents: state.currentEvents,
          holidays: holidaysWithDisplay,
        });
      } catch (error) {
        console.error("Помилка при отриманні даних з API:", error);
      }
    };

    fetchHolidays();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    modalShow.current = true;
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events: EventApi[]) => {
    setState({
      weekendsVisible: state.weekendsVisible,
      currentEvents: events,
      holidays: state.holidays,
    });
  };

  return (
    <div
      css={css`
        display: flex;
        min-height: 100%;
        font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
        font-size: 14px;
      `}
    >
      <div
        css={css`
          flex-grow: 1;
          padding: 3em;
        `}
      >
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={state.weekendsVisible}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          events={state.holidays}
          themeSystem="bootstrap5"
       
        />
      </div>
      <AddModal handleTitleChange={handleTitleChange} title={title}  /> 
    </div>
  );
};

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Calendar;
