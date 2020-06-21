import { useSelector } from 'react-redux';

import { RootState } from 'src/duck';
import { Employee } from 'src/entities/Employee';
import { Organization } from 'src/entities/Organizations';
import { Project } from 'src/entities/Project';
import { User } from '.';

export interface CurrentUser extends User {
  employee?: Employee;
  projects?: Project[];
  organization?: Organization;
}

/**
 * This function forcefully typecasts user to be non-nullable. It is developer's
 * responsibility to use this only in such situations, where it is guaranteed
 * that User exists e.g inside <WithUser>
 */
export const currentUser = (): CurrentUser => {
  const {
    auth: { activeEmployeeId, user },
    employees: { employees },
    organizations,
    project: { projects: allProjects },
  } = useSelector((state: RootState) => ({
    auth: state.auth,
    employees: state.employees,
    organizations: state.organizations,
    project: state.projects,
  }));

  const employee = employees.find((e) => e.ecode === activeEmployeeId);
  const organization = employee && organizations.entities[employee?.organization_id];
  const projects = allProjects.length
    ? allProjects.filter((p) => p.organization_id === organization?.id)
    : [];

  return { ...(user as User), employee, organization, projects };
};
