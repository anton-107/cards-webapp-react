import * as React from "react";
import {
  TextItem,
  TextareaListComponent,
  TextareaListComponentProperties,
} from "./textarea-list.component";
import { CheckboxComponent, TextWithCheckboxItem } from "./checkbox.component";

interface TextareaCheckboxListComponentProperties<T extends TextItem>
  extends Omit<TextareaListComponentProperties<T>, "beforeTextareaElement"> {
  onCheckboxUpdateRequest: (
    itemID: string,
    isChecked: boolean,
  ) => Promise<void>;
}

export function TextareaCheckboxListComponent<T extends TextWithCheckboxItem>(
  props: TextareaCheckboxListComponentProperties<T>,
): React.ReactElement {
  return (
    <div>
      <TextareaListComponent
        items={props.items}
        newItemPlaceholder={props.newItemPlaceholder}
        onNewItemCreateRequest={props.onNewItemCreateRequest}
        onItemUpdateRequest={props.onItemUpdateRequest}
        beforeTextareaElement={
          <CheckboxComponent
            onCheckboxUpdateRequest={(item: T, isChecked: boolean) =>
              props.onCheckboxUpdateRequest(item.id, isChecked)
            }
          />
        }
      />
    </div>
  );
}
