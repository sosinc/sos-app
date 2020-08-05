import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';

import style from 'src/components/Listing/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';

const c = classNames.bind(style);

export interface ListingItemProps {
  id: string;
  title: string;
  subtitle: string;
  logo: string;
  href?: string;
  Actions?: React.FC<{ id: string }>;
}

const LinkItem: React.FC<ListingItemProps> = (i) => {
  if (i.href) {
    return (
      <Link href={i.href}>
        <a className={c('title')}>{i.title}</a>
      </Link>
    );
  }
  return <span className={c('title')}>{i.title}</span>;
};

const ListingItem: React.FC<ListingItemProps> = (p) => {
  const Actions = p.Actions && (
    <div className={c('action')}>
      <p.Actions id={p.id} />
    </div>
  );

  return (
    <div className={c('content')} key={p.id}>
      <div className={c('fallback-icon')}>
        <FallbackIcon logo={p.logo} name={p.title} />
      </div>
      <div className={c('details')}>
        {LinkItem(p)}
        <span className={c('subtitle')}>{p.subtitle}</span>
      </div>

      {Actions}
    </div>
  );
};

const Skeleton = () => (
  <div className={c('skeleton')}>
    {ListingItem({ id: '', logo: '', title: 'ABC', subtitle: '0', href: '' })}
  </div>
);

interface ListingProps {
  isFetching?: boolean;
  items: ListingItemProps[];
  Actions?: React.FC<{ id: string }>;
  handlePagination?: any;
}

interface PaginationProps {
  isNext: boolean;
  isPrevious: boolean;
  handleOffset: any;
}

const PaginationButtons: React.FC<PaginationProps> = (p) => (
  <div className={c('pagination-buttons')}>
    <button
      className={c('load-button')}
      onClick={() => p.handleOffset('pre')}
      disabled={!p.isPrevious}
    >
      Previous
    </button>

    <button className={c('load-button')} onClick={() => p.handleOffset('next')} disabled={p.isNext}>
      Next
    </button>
  </div>
);

const Listing: React.FC<ListingProps> = (p) => {
  const [pagination, setPagination] = useState({ limit: 2, offset: 0 });
  const items = p.items.slice(pagination.offset, pagination.offset + pagination.limit);
  const isNext = p.items.length <= pagination.offset + pagination.limit;
  const isPrevious = pagination.offset > 0;

  const handleOffset = (mode: string) => {
    const newOffset =
      mode === 'pre' ? pagination.offset - pagination.limit : pagination.offset + pagination.limit;

    setPagination({ ...pagination, offset: newOffset });

    if (p.handlePagination) {
      p.handlePagination(newOffset, pagination.limit);
    }

    return;
  };

  return (
    <>
      <div className={c('container')}>
        {p.isFetching && <Skeleton />}
        {items.map((i) => ListingItem({ ...i, Actions: p.Actions }))}
      </div>
      <PaginationButtons isNext={isNext} isPrevious={isPrevious} handleOffset={handleOffset} />
    </>
  );
};

export default Listing;
