import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';

const c = classNames.bind(style);

interface Organizations {
  id: string;
  name: string;
  banner?: string;
  square_logo?: string;
}

interface FieldProps {
  list: Organizations[];
}

const List: React.FC<FieldProps> = ({ ...p }) => {
  const organizations = p.list.map((e) => (
    <div className={c('list-content')} key={e.id}>
      <div className={c('list-section1')}>
        <img className={c('item-wrapper')} src={e.square_logo} />
        <span className={c('name-wrapper')}>{e.name}</span>
      </div>
    </div>
  ));

  return <div className={c('list-container')}>{organizations}</div>;
};

export default List;
