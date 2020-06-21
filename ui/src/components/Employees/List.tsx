import classNames from 'classnames/bind';
import style from './style.module.scss';

import { Employee } from 'src/entities/Employee';
const c = classNames.bind(style);

interface FieldProps {
  employees: Employee[];
  isFetching?: boolean;
}

const EmployeeItem = (e: Employee) => (
  <div className={c('content')} key={e.ecode}>
    <div className={c('section1')}>
      <img className={c('headshot')} src={e.headshot} />
      <span className={c('name')}>{e.name}</span>
      <span className={c('designation')}>{e.designation_id}</span>
    </div>
    <div className={c('section2')}>
      <span className={c('project-title')}>Projects</span>
    </div>
  </div>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    <EmployeeItem
      designation_id=""
      ecode=""
      email=""
      headshot=""
      joining_date=""
      name=""
      organization_id=""
    />
  </div>
);

const List: React.FC<FieldProps> = (p) => {
  return (
    <div className={c('container')}>
      {p.isFetching && <Skeleton />}
      {p.employees.map(EmployeeItem)}
    </div>
  );
};

export default List;
