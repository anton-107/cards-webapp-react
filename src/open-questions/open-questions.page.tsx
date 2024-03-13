import { useEffect, useState } from "react";
import { SpaceProperties } from "../space/space-props";
import { TextareaCheckboxListComponent } from "../textarea-list/textarea-checkbox-list.component";
import { Question, QuestionsService } from "./questions-service";
import { QuestionControlsComponent } from "./questing-controls.component";
import { PeopleService, Person } from "../people/people-service";
import {
  PeopleGroup,
  PeopleGroupService,
} from "../people-groups/people-groups-service";

export class QuestionRecord {
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

  get recipients(): { [id: string]: string } {
    return this.question.attributes.recipients;
  }
}

export function OpenQuestionsPage(props: SpaceProperties): React.ReactElement {
  const service = new QuestionsService();
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);

  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<PeopleGroup[]>([]);

  const loadPeople = async () => {
    const peopleService = new PeopleService();
    const people = await peopleService.listAll(props.spaceID);
    setPeople(people);
  };

  const loadGroups = async () => {
    const groupsService = new PeopleGroupService();
    const groups = await groupsService.listAll(props.spaceID);
    setGroups(groups);
  };

  const loadOpenQuestions = async () => {
    const items = await service.listAll(props.spaceID);
    items.sort((a, b) => a.attributes.order - b.attributes.order);
    setQuestions(items.map((x) => new QuestionRecord(x)));
  };

  const createQuestion = async (text: string) => {
    await service.addOne(props.spaceID, {
      name: `Question`,
      parentCardID: "",
      attributes: {
        isCrossedOff: false,
        order: questions.length + 1,
        content: text,
        recipients: {},
        answers: {},
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

  const addRecipient = async (questionID: string, person: Person) => {
    const question = questions.find((x) => x.id === questionID);
    if (!question) {
      throw Error(`No such question found ${questionID}`);
    }
    question.recipients[person.id] = person.name;
    await updateRecipients(question);
  };

  const removeRecipient = async (questionID: string, person: Person) => {
    const question = questions.find((x) => x.id === questionID);
    if (!question) {
      throw Error(`No such question found ${questionID}`);
    }
    delete question.recipients[person.id];
    await updateRecipients(question);
  };

  const updateRecipients = async (question: QuestionRecord) => {
    await service.updateAttributes(props.spaceID, question.id, {
      attributes: {
        recipients: question.recipients,
      },
    });
    loadOpenQuestions();
  };

  useEffect(() => {
    loadOpenQuestions();
    loadPeople();
    loadGroups();
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
              afterTextareaElement={
                <QuestionControlsComponent
                  spaceID={props.spaceID}
                  people={people}
                  peopleGroups={groups}
                  onAddRecipient={addRecipient}
                  onRemoveRecipient={removeRecipient}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
