import classNames from 'classnames/bind';
import style from 'src/components/Projects/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';
import { Project } from 'src/entities/Project';

const c = classNames.bind(style);

interface Props {
  projects: Project[];
  isFetching?: boolean;
}

const ProjectItem: React.FC<Project> = (o) => (
  <div className={c('content')} key={o.id}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={o.logo_square} name={o.name} />
    </div>
    <div className={c('details')}>
      <span className={c('name')}>{o.name}</span>
      <span className={c('count')}> {o.teams_count} teams</span>
    </div>
  </div>
);

const Skeleton = () => (
  <div className={c('skeleton')}>
    <ProjectItem
      id=""
      name="AB"
      logo_square=""
      description=""
      issue_link_template=""
      pr_link_template=""
      organization_id=""
      teams_count={0}
    />
  </div>
);

const List: React.FC<Props> = (p) => {
  return (
    <div className={c('container')}>
      {p.isFetching && <Skeleton />}
      {p.projects.map(ProjectItem)}
    </div>
  );
};

export default List;
