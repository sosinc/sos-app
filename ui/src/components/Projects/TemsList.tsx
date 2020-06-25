import classNames from 'classnames/bind';
import Link from 'next/link';
import style from 'src/components/Projects/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';
import { Team } from 'src/entities/Team';

const c = classNames.bind(style);

interface Props {
  teams: Team[];
  isFetching?: boolean;
}

const TeamItem: React.FC<Team> = (o) => (
  <Link href={`/projects/${o.id}`} key={o.id}>
    <div className={c('content')}>
      <div className={c('fallback-icon')}>
        <FallbackIcon logo={o.logo_square} name={o.name} />
      </div>
      <div className={c('details')}>
        <span className={c('name')}>{o.name}</span>
        <span className={c('count')}> {0} members</span>
      </div>
    </div>
  </Link>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    <TeamItem
      id=""
      name="AB"
      logo_square=""
      issue_link_template=""
      pr_link_template=""
      project_id=""
      banner=""
    />
  </div>
);

const List: React.FC<Props> = (p) => {
  return (
    <div className={c('container')}>
      {p.isFetching && <Skeleton />}
      {p.teams.map(TeamItem)}
    </div>
  );
};

export default List;
