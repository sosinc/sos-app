import { FormikHelpers } from 'formik';
import OuterForm, { UpdateProfileFormValues } from 'src/components/Profile';
import DashboardLayout from 'src/containers/DashboardLayout';
import { updateProfileAction } from 'src/duck/auth';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk } from 'src/lib/asyncHooks';
const Header: React.FC = () => <div>Profile</div>;
/*
 * const router = useRouter();
 * const queryId = String(router.query.id);
 * const organization = useSelector((state: RootState) => orgSelector.selectById(state, queryId)); */

/* const [isFetchingOrg] = useQuery(() => fetchCurrentUser(), {
 *   errorTitle: 'Failed to fetch cuurrent user details',
 * });
 *  */
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
    try {
      helpers.setSubmitting(true);
      await updateProfile({ ...values });
    } catch (err) {
      helpers.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={'Snake Oil Software - Profile'} Header={Header}>
      <OuterForm onSubmit={handleSubmit} values={formValues} />
    </DashboardLayout>
  );
};
