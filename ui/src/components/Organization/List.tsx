import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
}

const defaultBand = (brand: string, name: string) => {
  if (brand && brand.length) {
    return <img className={c('brand')} src={brand} />;
  } else {
    const firstLetter = name.split('')[0];
    return (
      <div className={c('default-brand')}>
        <span className={c('default-icon')}>{firstLetter}</span>
      </div>
    );
  }
};

const OrgItem: React.FC<Organization> = (p) => (
  <div className={c('container')}>
    <div className={c('content')} key={p.id}>
      {defaultBand(p.square_logo, p.name)}
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
