import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';

const Dashboard = () => {
  return (
    <Layout headerTitle={'Snake Oil Software - Dashboard'} redirectPath="/">
      <Header title={'Dashboard'} redirectPath={'/'} />
    </Layout>
  );
};

export default Dashboard;
