import { useSelector } from 'react-redux';

import { RootState } from 'src/duck';
import { AuthState } from 'src/duck/auth';
import { EmployeeState } from 'src/duck/employee';
import { ProjectState } from 'src/duck/project';

export const getUsersOrganizationId = () => {
  const { activeEmployeeId } = useSelector<RootState, AuthState>((state) => state.auth);
  const { employees } = useSelector<RootState, EmployeeState>((state) => state.employees);

  const emp = activeEmployeeId?.length ? employees.find((e) => e.ecode === activeEmployeeId) : null;
  return emp?.organization_id ? emp.organization_id : null;
};

export const getUsersProjects = () => {
  const orgId = getUsersOrganizationId();
  const { projects } = useSelector<RootState, ProjectState>((state) => state.projects);
  return projects.length && orgId
    ? projects.filter((pro) => pro.organization_id === orgId)
    : [];
};
