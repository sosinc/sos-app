import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
}

const OrgItem: React.FC<Organization> = (p) => (
  <div className={c('container')}>
    <div className={c('content')} key={p.id}>
      <img className={c('brand')} src={p.square_logo} />
      <div className={c('employee-container')}>
        <span className={c('name')}>{p.name}</span>
        <span className={c('count')}>{p.employees_aggregate.aggregate.count} Employees</span>
      </div>
    </div>
  </div>
);

const List: React.FC<Props> = (p) => {
  return <div className={c('employee')}>{p.organizations.map(OrgItem)}</div>;
};

export default List;
