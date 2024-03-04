import * as React from "react";
import { FormEvent, useRef, useState } from "react";

import { PeopleGroupService } from "./people-groups-service";
import { SpaceProperties } from "../space/space-props";

interface AddGroupComponentProperties extends SpaceProperties {
  onItemAdded: () => void;
}

export function AddGroupComponent(
  props: AddGroupComponentProperties,
): React.ReactElement {
  const peopleService = new PeopleGroupService();
  const [groupName, setGroupName] = useState<string>("");
  const [isInputDisabled, setInputDisabled] = useState<boolean>(false);
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const nameInputElement = useRef(null);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setInputDisabled(true);
    await peopleService.addOne(props.spaceID, {
      name: groupName,
      parentCardID: "",
      attributes: {},
    });
    setInputDisabled(false);
    setGroupName("");
    setFormVisible(false);
    props.onItemAdded();
  };
  const showForm = () => {
    setFormVisible(true);
  };
  const hideForm = () => {
    setFormVisible(false);
  };
  return (
    <div>
      {!isFormVisible && (
        <button
          className="simple-button"
          onClick={showForm}
          data-testid="add-group-button"
        >
          + Add group
        </button>
      )}
      {isFormVisible && (
        <form onSubmit={(e) => submitForm(e)} data-testid="add-group-form">
          <h2>Add a new group</h2>
          <div className="form-field-block">
            <label>Group name (e.g. peers, leadership, reports): </label>
            <input
              ref={nameInputElement}
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
              data-testid="add-group-name-input"
              placeholder="Group name"
              disabled={isInputDisabled}
            />
          </div>
          <div>
            <input type="submit" value="Add group" />
            &nbsp;
            <input
              type="button"
              value="Cancel"
              onClick={hideForm}
              data-testid="adding-group-cancel-button"
            />
          </div>
        </form>
      )}
    </div>
  );
}
