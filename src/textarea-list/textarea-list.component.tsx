import * as React from "react";
import { useRef, useState } from "react";
import { TextareaComponent } from "./textarea.component";

export interface TextItem {
  readonly id: string;
  readonly textValue: string;
}

export interface TextareaListComponentProperties<T extends TextItem> {
  items: T[];
  newItemPlaceholder: string;
  onNewItemCreateRequest: (newItemText: string) => Promise<void>;
  onItemUpdateRequest: (itemID: string, editedText: string) => Promise<void>;
  beforeTextareaElement: React.ReactElement;
}

export const END_OF_LINE_POSITION = -2;

export function TextareaListComponent<T extends TextItem>(
  props: TextareaListComponentProperties<T>,
): React.ReactElement {
  const newItemElement = useRef(null);
  const [newItemText, setNewItemText] = useState<string>("");
  const [focusElementIndex, setFocusElementIndex] = useState<number>(-1);
  const [focusStartPosition, setFocusStartPosition] = useState<number>(-1);

  const createItem = async (text: string) => {
    setNewItemText("");
    props.onNewItemCreateRequest(text);
  };
  const updateItem = async (itemID: string, text: string) => {
    props.onItemUpdateRequest(itemID, text);
  };

  const createOnEnter = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newItemText) {
        await createItem(newItemText);
      }
    }
  };

  const focusOnNextItem = (
    currentIndex: number,
    startPosition: number,
    isEndOfLine: boolean,
  ) => {
    if (props.items.length > currentIndex + 1) {
      setFocusElementIndex(currentIndex + 1);
      setFocusStartPosition(isEndOfLine ? END_OF_LINE_POSITION : startPosition);
    }
  };

  const focusOnPreviousItem = (
    currentIndex: number,
    startPosition: number,
    isEndOfLine: boolean,
  ) => {
    if (currentIndex - 1 >= 0) {
      setFocusElementIndex(currentIndex - 1);
      setFocusStartPosition(isEndOfLine ? END_OF_LINE_POSITION : startPosition);
    }
  };

  return (
    <div>
      {props.items.map((item, index) => {
        return (
          <div key={`textarea-list-item-${item.id}`}>
            {React.cloneElement(props.beforeTextareaElement, { item })}
            <TextareaComponent
              value={item.textValue}
              onItemUpdateRequest={(editedText: string) =>
                updateItem(item.id, editedText)
              }
              onMoveToNext={(startPosition, isEndOfLine) =>
                focusOnNextItem(index, startPosition, isEndOfLine)
              }
              onMoveToPrevious={(startPosition, isEndOfLine) =>
                focusOnPreviousItem(index, startPosition, isEndOfLine)
              }
              focusStartPosition={
                index === focusElementIndex ? focusStartPosition : null
              }
            />
          </div>
        );
      })}
      <textarea
        ref={newItemElement}
        value={newItemText}
        className="lightweight-textarea"
        placeholder={props.newItemPlaceholder}
        rows={1}
        cols={100}
        onChange={(e) => setNewItemText(e.target.value)}
        onKeyDown={(e) => createOnEnter(e)}
      ></textarea>
    </div>
  );
}
