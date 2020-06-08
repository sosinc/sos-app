import { useDispatch } from 'react-redux';

import LoginForm from 'src/components/LoginForm';
import Layout from 'src/containers/Layout';
import { loginUser } from 'src/duck/auth';

import c from './index.module.scss';

const Index = () => {
  const dispatch = useDispatch();

  const handleLogin = (values: any) => {
    dispatch(loginUser(values));
  };

  return (
    <Layout
      headerTitle={'snake oil software - app'}
      redirectPath={'/organizations'}
      inverted={true}
    >
      <span className={c.brandName}>
        <img className={c.superLogo} src="/assets/images/sos-logo.svg" alt="O" />
        <h4>Snake Oil Software</h4>
      </span>

      <span className={c.hero}>
        <h1>
          Transparent teams
          <br />
          for mindful development
        </h1>
      </span>

      <span className={c.brief}>
        <p>
          Missing piece between Jira and Slack, SoS keeps entire team on same page with daily
          commitments, challenges and more.
        </p>
      </span>

      <LoginForm onSubmit={handleLogin} />
    </Layout>
  );
};

export default Index;
