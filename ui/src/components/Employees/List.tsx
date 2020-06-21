import classNames from 'classnames/bind';
import FallbackIcon from 'src/containers/FallbackIcon';
import style from './style.module.scss';

import { Employee } from 'src/entities/Employee';
const c = classNames.bind(style);

interface FieldProps {
  employees: Employee[];
  isFetching?: boolean;
}

const EmployeeItem = (e: Employee) => (
  <div className={c('content')} key={e.ecode}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={e.headshot} name={e.name} />
    </div>
    <div className={c('details')}>
      <span className={c('name')}>{e.name}</span>
      <span className={c('designation')}>{e.designation_id} </span>
    </div>
  </div>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    <EmployeeItem
      designation_id="AB"
      ecode=""
      email=""
      headshot=""
      joining_date=""
      name="ABC"
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
