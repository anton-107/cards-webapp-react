import { NavLink } from "react-router-dom";
import { Person } from "../people/people-service";

interface PersonHeaderComponentProperties {
  person: Person;
}

export function PersonHeaderComponent(
  props: PersonHeaderComponentProperties,
): React.ReactElement {
  return (
    <div>
      <div className="content-block">
        {props.person && (
          <div>
            <h1>{props.person.name}</h1>
            <ul className="horizontal-menu">
              <li>
                <NavLink
                  data-testid="person-meetings-link"
                  end
                  to={`/person/${props.person.id}`}
                  className={({ isActive }) =>
                    isActive ? "active-nav-link" : ""
                  }
                >
                  Meetings
                </NavLink>
              </li>
              <li>
                <NavLink
                  data-testid="person-actionitems-link"
                  to={`/person/${props.person.id}/action-items`}
                  className={({ isActive }) =>
                    isActive ? "active-nav-link" : ""
                  }
                >
                  Action items
                </NavLink>
              </li>
              <li>
                <NavLink
                  data-testid="person-objectives-link"
                  to={`/person/${props.person.id}/objectives`}
                  className={({ isActive }) =>
                    isActive ? "active-nav-link" : ""
                  }
                >
                  Objectives
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
