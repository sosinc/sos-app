import classNames from 'classnames/bind';
import Link from 'next/link';
import style from 'src/components/Listing/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';

const c = classNames.bind(style);

export interface ListItemProps {
  id: string;
  title: string;
  subtitle: string;
  logo: string;
  href?: string;
}

const LinkItem: React.FC<ListItemProps> = (i) => {
  if (i.href) {
    return (
      <Link href={i.href}>
        <a className={c('title')}>{i.title}</a>
      </Link>
    );
  }
  return <span className={c('title')}>{i.title}</span>;
};

const ListItem: React.FC<ListItemProps> = (i) => (
  <div className={c('content')} key={i.id}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={i.logo} name={i.title} />
    </div>
    <div className={c('details')}>
      {LinkItem(i)}
      <span className={c('subtitle')}>{i.subtitle}</span>
    </div>
  </div>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    {ListItem({ id: '', logo: '', title: 'ABC', subtitle: '0', href: '' })}
  </div>
);

interface ListProps {
  isFetching?: boolean;
  items: ListItemProps[];
}

const Listing: React.FC<ListProps> = (p) => {
  return (
    <div className={c('container')}>
      {p.isFetching && <Skeleton />}
      {p.items.map(ListItem)}
    </div>
  );
};

export default Listing;
