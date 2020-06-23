import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  isFetching?: boolean;
  organizations: Organization[];
}

const OrgItem: React.FC<Organization> = (o) => (
  <div className={c('organization')} key={o.id}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={o.square_logo} name={o.name} />
    </div>
    <div className={c('organization-details')}>
      <span className={c('name')}>{o.name}</span>
      <span className={c('count')}>{o.employees_count} Employees</span>
    </div>
  </div>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    {OrgItem({ banner: '', id: '', square_logo: '', name: 'ABC', employees_count: 0 })}
  </div>
);

const List: React.FC<Props> = (p) => {
  return (
    <div className={c('container')}>
      {p.isFetching && <Skeleton />}
      {p.organizations.map(OrgItem)}
    </div>
  );
};

export default List;
