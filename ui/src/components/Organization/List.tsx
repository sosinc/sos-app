import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
}

const OrgItem: React.FC<Organization> = (p) => (
  <div className={c('content')} key={p.id}>
    <div className={c('section1')}>
      <img className={c('logo')} src={p.square_logo} />
      <span className={c('name')}>{p.name}</span>
    </div>
  </div>
);

const List: React.FC<Props> = (p) => {
  return <div className={c('container')}>{p.organizations.map(OrgItem)}</div>;
};

export default List;
