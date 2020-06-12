import classNames from 'classnames/bind';
import style from './style.module.scss';

import { Employee } from 'src/entities/Employee';
const c = classNames.bind(style);

interface FieldProps {
  employees: Employee[];
}

const List: React.FC<FieldProps> = ({ ...p }) => {
  const employee = p.employees.map((e) => (
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
  ));

  return <div className={c('container')}>{employee}</div>;
};

export default List;
