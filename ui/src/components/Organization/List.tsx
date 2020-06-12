import classNames from 'classnames/bind';
import Link from 'next/link';
import style from 'src/components/Organization/style.module.scss';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface OrganizationProps {
  organizations: Organization[];
}

const List: React.FC<OrganizationProps> = ({ ...p }) => {
  const organizations = p.organizations.map((e) => (
    <Link key={e.id} href={`/organizations/${e.id}`}>
      <div className={c('content')}>
        <div className={c('section1')}>
          <img className={c('logo')} src={e.square_logo} />
          <span className={c('name')}>{e.name}</span>
        </div>
      </div>
    </Link>
  ));

  return <div className={c('container')}>{organizations}</div>;
};

export default List;
