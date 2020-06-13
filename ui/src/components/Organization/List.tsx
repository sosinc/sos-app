import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
}

const OrgLogo: React.FC<{ organization: Organization }> = ({ organization: o }) => {
  const firstLetter = o.name[0].toUpperCase();
  if (o.square_logo) {
    return <img className={c('brand')} src={o.square_logo} />;
  }

  return (
    <div className={c('fallback-brand')}>
      <span className={c('fallback-icon')}>{firstLetter}</span>
    </div>
  );
};

const OrgItem: React.FC<Organization> = (o) => (
  <div className={c('container')} key={o.id}>
    <OrgLogo organization={o} />
    <div className={c('organization-container')}>
      <span className={c('name')}>{o.name}</span>
      <span className={c('count')}>{o.employees_count} Employees</span>
    </div>
  </div>
);

const List: React.FC<Props> = (p) => {
  return <div className={c('organization')}>{p.organizations.map(OrgItem)}</div>;
};

export default List;
