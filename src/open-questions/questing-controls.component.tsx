import { useEffect, useState } from "react";
import { SpaceProperties } from "../space/space-props";
import { QuestionCheckboxText } from "./open-questions.page";

interface QuestionControlsComponentProperties extends SpaceProperties {
  item?: QuestionCheckboxText;
}

export function QuestionControlsComponent(
  props: QuestionControlsComponentProperties,
): React.ReactElement {
  const [isRecipientDropdownVisible, setRecipientDropdownVisible] =
    useState(false);

  // close menu's on document click:
  useEffect(() => {
    // Function to handle click event
    const handleDocumentClick = () => {
      setRecipientDropdownVisible(false);
    };
    // Attach the event listener to the document
    document.addEventListener("click", handleDocumentClick);
    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="textarea-list-additional-controls">
      Recipients:{" "}
      <button
        className="simple-button"
        onClick={(e) => {
          e.stopPropagation();
          setRecipientDropdownVisible(true);
        }}
      >
        add
      </button>
      <div
        className={`dropdown-menu ${isRecipientDropdownVisible ? "open" : "closed"}`}
      >
        <div className="dropdown-content shadow-box">
          <ul>
            <li>Everybody</li>
            <li>Recipient #1</li>
            <li>Recipient #2</li>
            <li>Recipient #3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
