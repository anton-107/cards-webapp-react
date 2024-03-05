import Calendar from "react-calendar";
import { Meeting } from "./meetings-service";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";

interface MeetingDateComponentProperties {
  meeting: Meeting;
  onDateChange: (newTimestamp: number) => Promise<void>;
}
export function MeetingDateComponent(
  props: MeetingDateComponentProperties,
): React.ReactElement {
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const toggleCalendar = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setCalendarVisible(!isCalendarVisible);
  };

  // close menu's on document click:
  useEffect(() => {
    // Function to handle click event
    const handleDocumentClick = () => {
      setCalendarVisible(false);
    };
    // Attach the event listener to the document
    document.addEventListener("click", handleDocumentClick);
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const formatDate = (timestamp: number): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (err) {
      return "Invalid date";
    }
  };

  const updateMeetingStartDate = async (newDate: Date) => {
    setCalendarVisible(false);
    await props.onDateChange(newDate.getTime());
  };

  return (
    <div className="inline-date" onClick={(e) => toggleCalendar(e)}>
      {formatDate(props.meeting.attributes.dateStart)}
      {isCalendarVisible && (
        <div className="popup-calendar" onClick={(e) => e.stopPropagation()}>
          <Calendar
            value={new Date(props.meeting.attributes.dateStart)}
            onClickDay={(date) => updateMeetingStartDate(date)}
          />
        </div>
      )}
    </div>
  );
}
