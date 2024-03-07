import { useEffect, useState } from "react";
import { SpaceProperties } from "../space/space-props";
import { TextareaCheckboxListComponent } from "../textarea-list/textarea-checkbox-list.component";
import { Question, QuestionsService } from "./questions-service";

class QuestionCheckboxText {
  public readonly id: string;

  constructor(private question: Question) {
    this.id = question.id;
  }

  get textValue(): string {
    return this.question.attributes.content;
  }

  get isChecked(): boolean {
    return this.question.attributes.isCrossedOff;
  }
}

export function OpenQuestionsPage(props: SpaceProperties): React.ReactElement {
  const service = new QuestionsService();
  const [questions, setQuestions] = useState<QuestionCheckboxText[]>([]);

  const loadOpenQuestions = async () => {
    const items = await service.listAll(props.spaceID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setQuestions(items.map((x) => new QuestionCheckboxText(x)));
  };

  const createQuestion = async (text: string) => {
    await service.addOne(props.spaceID, {
      name: `Question`,
      parentCardID: "",
      attributes: {
        isCrossedOff: false,
        order: questions.length + 1,
        content: text,
        recipients: [],
      },
    });
    loadOpenQuestions();
  };

  const updateQuestionText = async (itemID: string, text: string) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        content: text,
      },
    });
  };

  const updateQuestionCrossedOff = async (
    itemID: string,
    isCrossedOff: boolean,
  ) => {
    await service.updateAttributes(props.spaceID, itemID, {
      attributes: {
        isCrossedOff,
      },
    });
  };

  useEffect(() => {
    loadOpenQuestions();
  }, []);

  return (
    <div className="single-page-container">
      <div className="content-block">
        <div className="content-box">
          <h2>Open questions</h2>
          <div>
            <TextareaCheckboxListComponent
              items={questions}
              newItemPlaceholder="New question"
              onNewItemCreateRequest={createQuestion}
              onItemUpdateRequest={updateQuestionText}
              onCheckboxUpdateRequest={updateQuestionCrossedOff}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
