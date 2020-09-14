import { FormikHelpers } from 'formik';

import OuterForm, { UpdateProfileFormValues } from 'src/components/Profile';
import config from 'src/config';
import DashboardLayout from 'src/containers/DashboardLayout';
import { updateProfileAction } from 'src/duck/auth';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk } from 'src/lib/asyncHooks';
const Header: React.FC = () => <div>Profile</div>;

export default () => {
  const user = currentUser();
  const formValues: UpdateProfileFormValues = {
    fullname: user.name || '',
    profile_pic: user.avatar || '',
  };

  const [updateProfile] = useAsyncThunk(updateProfileAction, {
    errorTitle: 'Failed to update Profile',
    rethrowError: true,
    successTitle: 'Profile updated successfully',
  });

  const handleSubmit = async (
    values: UpdateProfileFormValues,
    helpers: FormikHelpers<UpdateProfileFormValues>,
  ) => {
    const currentUserId = user.id;

    try {
      helpers.setSubmitting(true);
      await updateProfile({ ...values, id: currentUserId });
    } catch (err) {
      helpers.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={`Profile - ${config.appName}`} Header={Header}>
      <OuterForm onSubmit={handleSubmit} values={formValues} />
    </DashboardLayout>
  );
};
