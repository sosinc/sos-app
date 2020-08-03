import DashboardLayout from 'src/containers/DashboardLayout';
import OuterForm from 'src/components/Profile';
const Header: React.FC = () => <div>Profile</div>;

const handleSubmit = async () => console.warn('Update Profile');

export default () => {
  return (
    <DashboardLayout title={'Snake Oil Software - Profile'} Header={Header}>
      <OuterForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
};
