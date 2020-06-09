import classNames from 'classnames/bind';
import style from './style.module.scss';

const c = classNames.bind(style);

interface EmployeeList {
  id: string;
  name: string;
  headShot?: string;
  organization: any[];
  designation: string;
}

interface FieldProps {
  list: EmployeeList[];
}

const organization = (org: any) => {
  return (
    <span className={c('list-section2-item')} key={org}>
      {org}
    </span>
  );
};

const List: React.FC<FieldProps> = ({ ...p }) => {
  const employee = p.list.map((e) => (
    <div className={c('employee-content')} key={e.id}>
      <div className={c('list-section1')}>
        <img className={c('employee-headshot-wrapper')} src={e.headShot} />
        <span className={c('employee-name-wrapper')}>{e.name}</span>
        <span className={c('employee-designation-wrapper')}>{e.designation}</span>
      </div>
      <div className={c('list-section2')}>
        <span className={c('list-section2-title')}>Projects</span>
        <div className={c('list-section2-wrapper')}>
          {e.organization.map((org) => organization(org))}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={c('employee-list-container')}>
      <h2>Employees</h2>
      {employee}
    </div>
  );
};

export default List;
