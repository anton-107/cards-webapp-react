import * as React from "react";

interface MeetingsListComponentProperties {
  mettings: Meeting[];
}

export function MeetingsListComponent(
  props: MeetingsListComponentProperties,
): React.ReactElement {
  return <div>List of meetings</div>;
}
