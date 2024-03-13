import { useEffect, useState } from "react";
import {
  Question,
  QuestionsService,
} from "../../open-questions/questions-service";
import { SpaceProperties } from "../../space/space-props";
import { Person } from "../../people/people-service";
import { TextareaComponent } from "../../textarea-list/textarea.component";

interface OpenQuestionsInPersonMeetingComponentProperties
  extends SpaceProperties {
  person: Person;
}
export function OpenQuestionsInPersonMeetingComponent(
  props: OpenQuestionsInPersonMeetingComponentProperties,
): React.ReactElement {
  const service = new QuestionsService();
  const [questions, setQuestions] = useState<Question[]>();

  const loadQuestions = async () => {
    const items = await service.listAll(props.spaceID);
    const questionsToPerson = items.filter(
      (item) => props.person.id in item.attributes.recipients,
    );
    setQuestions(questionsToPerson);
  };

  const updateResponse = async (question: Question, newText: string) => {
    await service.updateAttributes(props.spaceID, question.id, {
      attributes: {
        answers: {
          ...question.attributes.answers,
          [props.person.id]: newText,
        },
      },
    });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div>
      {questions &&
        questions.map((q) => {
          return (
            <div key={`question-${q.id}`}>
              <div>
                <input type="checkbox" /> {q.attributes.content}
              </div>
              <div className="form-section">
                <div className="section-detail">
                  recipients:{" "}
                  {Object.values(q.attributes.recipients).map(
                    (recipientName) => {
                      return (
                        <span
                          key={`q-${q.id}-${recipientName}`}
                          className={`inline-tag ${recipientName === props.person.name ? "highlighted-tag" : ""} `}
                        >
                          {recipientName}
                        </span>
                      );
                    },
                  )}
                </div>
                <div className="single-textarea-wrapper">
                  <TextareaComponent
                    value={
                      q.attributes.answers
                        ? q.attributes.answers[props.person.id]
                        : ""
                    }
                    focusStartPosition={null}
                    onMoveToNext={() => {}}
                    onMoveToPrevious={() => {}}
                    onItemUpdateRequest={async (text: string) => {
                      updateResponse(q, text);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
