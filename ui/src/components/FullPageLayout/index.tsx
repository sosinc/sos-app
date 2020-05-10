import c from './style.module.scss';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const FullPageLayout: React.FC<Props> = ({ children, className }) => (
  <div className={className || '' + ' ' + c.container}>{children}</div>
);

export default FullPageLayout;
