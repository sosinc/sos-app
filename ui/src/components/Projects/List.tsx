import classNames from 'classnames/bind';
import style from 'src/components/Projects/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';
import { Project } from 'src/entities/Project';

const c = classNames.bind(style);

interface Props {
  projects: Project[];
}

const ProjectItem: React.FC<Project> = (o) => (
  <div className={c('container')} key={o.id}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={o.logo_square} name={o.name} />
    </div>
    <div className={c('organization-container')}>
      <span className={c('name')}>{o.name}</span>
      <span className={c('count')}> Team</span>
    </div>
  </div>
);

const List: React.FC<Props> = (p) => {
  return <div className={c('organization')}>{p.projects.map(ProjectItem)}</div>;
};

export default List;
