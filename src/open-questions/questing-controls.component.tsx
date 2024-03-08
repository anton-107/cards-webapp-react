import { useEffect, useState } from "react";
import { SpaceProperties } from "../space/space-props";
import { QuestionRecord } from "./open-questions.page";
import { Person } from "../people/people-service";
import { PeopleGroup } from "../people-groups/people-groups-service";

interface QuestionControlsComponentProperties extends SpaceProperties {
  item?: QuestionRecord;
  people: Person[];
  peopleGroups: PeopleGroup[];
  onAddRecipient: (questionID: string, person: Person) => Promise<void>;
  onRemoveRecipient: (questionID: string, person: Person) => Promise<void>;
}

export function QuestionControlsComponent(
  props: QuestionControlsComponentProperties,
): React.ReactElement {
  const [isRecipientDropdownVisible, setRecipientDropdownVisible] =
    useState(false);

  const toggleRecipient = (person: Person, isChecked: boolean) => {
    if (!props.item) {
      return;
    }
    if (isChecked) {
      props.onAddRecipient(props.item.id, person);
    } else {
      props.onRemoveRecipient(props.item.id, person);
    }
  };

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
      {props.item &&
        Object.values(props.item.recipients).map((recipient) => {
          return <span className="inline-tag">{recipient}</span>;
        })}
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
        <div
          className="dropdown-content shadow-box"
          onClick={(e) => e.stopPropagation()}
        >
          {props.peopleGroups.map((group: PeopleGroup) => {
            return (
              <div key={`question-control-group-${group.id}`}>
                <h3 className="">
                  <label>
                    <input type="checkbox" /> {group.name}
                  </label>
                </h3>
                <ul className="actions-list">
                  {props.people
                    .filter(
                      (person: Person) =>
                        person.attributes.groupID === group.id,
                    )
                    .map((person: Person) => {
                      return (
                        <li key={`question-control-person-${person.id}`}>
                          <label>
                            <input
                              type="checkbox"
                              checked={
                                props.item &&
                                Boolean(props.item.recipients[person.id])
                              }
                              onChange={(e) =>
                                toggleRecipient(person, e.target.checked)
                              }
                            />{" "}
                            {person.name}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
