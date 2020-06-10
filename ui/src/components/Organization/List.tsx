import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

import { Employee } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface OrganizationProps {
  list: Employee[];
}

const List: React.FC<OrganizationProps> = ({ ...p }) => {
  const organizations = p.list.map((e) => (
    <div className={c('content')} key={e.id}>
      <div className={c('section1')}>
        <img className={c('logo')} src={e.square_logo} />
        <span className={c('name')}>{e.name}</span>
      </div>
    </div>
  ));

  return <div className={c('container')}>{organizations}</div>;
};

export default List;
