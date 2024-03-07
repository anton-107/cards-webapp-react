import { ChangeEvent, useEffect, useState } from "react";
import { TextItem } from "./textarea-list.component";

export interface TextWithCheckboxItem extends TextItem {
  isChecked: boolean;
}

interface CheckboxComponentProperties<T extends TextWithCheckboxItem> {
  item?: T;
  onCheckboxUpdateRequest: (item: T, isChecked: boolean) => void;
}

export function CheckboxComponent<T extends TextWithCheckboxItem>(
  props: CheckboxComponentProperties<T>,
): React.ReactElement {
  const [isChecked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (props.item) {
      setChecked(props.item.isChecked);
    }
  }, [props.item]);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!props.item) {
      throw Error(
        "Item is not defined when trying to change the checkbox component",
      );
    }
    setChecked(event.target.checked);
    props.onCheckboxUpdateRequest(props.item, event.target.checked);
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange}
    />
  );
}
