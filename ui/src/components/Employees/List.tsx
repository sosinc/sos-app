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
    <span className={c('project-items')} key={org}>
      {org}
    </span>
  );
};

const List: React.FC<FieldProps> = ({ ...p }) => {
  const employee = p.list.map((e) => (
    <div className={c('content')} key={e.id}>
      <div className={c('section1')}>
        <img className={c('headshot')} src={e.headShot} />
        <span className={c('name')}>{e.name}</span>
        <span className={c('designation')}>{e.designation}</span>
      </div>
      <div className={c('section2')}>
        <span className={c('project-title')}>Projects</span>
        <div className={c('project-container')}>
          {e.organization.map((org) => organization(org))}
        </div>
      </div>
    </div>
  ));

  return <div className={c('container')}>{employee}</div>;
};

export default List;
