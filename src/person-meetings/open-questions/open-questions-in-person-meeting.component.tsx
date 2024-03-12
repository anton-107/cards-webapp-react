import { useEffect, useState } from "react";
import {
  Question,
  QuestionsService,
} from "../../open-questions/questions-service";
import { SpaceProperties } from "../../space/space-props";

interface OpenQuestionsInPersonMeetingComponentProperties
  extends SpaceProperties {
  personID: string;
}
export function OpenQuestionsInPersonMeetingComponent(
  props: OpenQuestionsInPersonMeetingComponentProperties,
): React.ReactElement {
  const service = new QuestionsService();
  const [questions, setQuestions] = useState<Question[]>();

  const loadQuestions = async () => {
    const items = await service.listAll(props.spaceID);
    const questionsToPerson = items.filter(
      (item) => props.personID in item.attributes.recipients,
    );
    setQuestions(questionsToPerson);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div>
      <ul>
        {questions &&
          questions.map((q) => {
            return (
              <li>
                {q.attributes.content} (recipients:{" "}
                {Object.values(q.attributes.recipients).join(", ")})
              </li>
            );
          })}
      </ul>
    </div>
  );
}
