import { useEffect, useState } from "react";

interface MeetingsActionsComponentProperties {
  meetingID: string;
  onMeetingDeletionRequest: () => void;
}
export function MeetingsActionsComponent(
  props: MeetingsActionsComponentProperties,
): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const deleteMeeting = () => {
    props.onMeetingDeletionRequest();
  };

  // close menu's on document click:
  useEffect(() => {
    // Function to handle click event
    const handleDocumentClick = () => {
      setIsMenuOpen(false);
    };
    // Attach the event listener to the document
    document.addEventListener("click", handleDocumentClick);
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div
      data-testid={`meeting-actions-dropdown-menu-${props.meetingID}`}
      className={isMenuOpen ? "dropdown-menu open" : "dropdown-menu"}
    >
      <button
        className="simple-button dropdown-button"
        onClick={(e) => openMenu(e)}
        data-testid={`person-actions-menu-button-${props.meetingID}`}
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      <div className="dropdown-content dropdown-content-person-actions">
        <ul className="actions-list">
          <li className="warning-action">
            <a
              href="#"
              onClick={() => deleteMeeting()}
              data-testid={`action-delete-person-${props.meetingID}`}
            >
              Delete this meeting entry
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
