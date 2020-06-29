import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';
import ImageUploadField from 'src/components/Form/ImageUploadField';
import TextField from 'src/components/Form/TextField';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchProject, projectSelector } from 'src/duck/projects';
import { createTeamAction } from 'src/duck/teams';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const projectId = String(router.query.id);
  useQuery(() => fetchProject({ id: projectId }), {
    errorTitle: 'Failed to fetch some project details',
  });

  const project = useSelector((state: RootState) => projectSelector.selectById(state, projectId));
  return (
    <div className={c('header')}>
      <span>
        <Link href="/projects">
          <a>Projects > </a>
        </Link>
        <Link href={`/projects/${projectId}`}>
          <a> {project?.name || 'Project'} > </a>
        </Link>
        Add Team
      </span>
    </div>
  );
};

const CreateTeam: React.FC<FormikProps<FormValues>> = (p) => {
  return (
    <div className={c('container')}>
      <form className={c('form')} onSubmit={p.handleSubmit}>
        <div className={c('title-container')}>
          <h2>Create Team</h2>
        </div>
        <div className={c('name-container', 'field-container')}>
          <span className={c('field-title')}>Name</span>
          <TextField placeholder="Enter Name" type="text" name="name" />
        </div>

        <div className={c('square-logo', 'field-container')}>
          <span className={c('field-title')}>Square Logo</span>
          <ImageUploadField className={c('image-container')} type={'file'} name="logo_square" />
        </div>

        <div className={c('right-container')}>
          <div className={c('issue-link-container', 'field-container')}>
            <span className={c('field-title')}>Issue Link Template</span>
            <TextField
              placeholder="Enter issue Link Template"
              type="text"
              name="issue_link_template"
            />
          </div>
          <div className={c('pr-link-container', 'field-container')}>
            <span className={c('field-title')}>Pr Link Template</span>
            <TextField placeholder="Enter pr link template" type="text" name="pr_link_template" />
          </div>
        </div>

        <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
          <div className={c({ 'saving-in': p.isSubmitting })}>
            {p.isSubmitting ? 'Saving...' : 'Save'}
            <span />
          </div>
        </button>
      </form>
    </div>
  );
};

interface FormValues {
  name: string;
  logo_square: string;
  issue_link_template: string;
  pr_link_template: string;
}

const initialValues = {
  issue_link_template: '',
  logo_square: '',
  name: '',
  pr_link_template: '',
};

const validationSchema = Yup.object().shape({
  issue_link_template: Yup.string(),
  logo_square: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  pr_link_template: Yup.string(),
});

export default () => {
  const router = useRouter();
  const projectId = String(router.query.id);

  const [createTeam] = useAsyncThunk(createTeamAction, {
    errorTitle: 'Failed to crate Team',
    rethrowError: true,
    successTitle: 'Team created successfully',
  });

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      actions.setSubmitting(true);
      await createTeam({ ...values, project_id: projectId });
      actions.resetForm();
    } catch (err) {
      if (/Duplicate team name/i.test(err.message)) {
        actions.setFieldError('name', 'A team with same name already exists');
      }
      actions.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={'Projects - Snake Oil Software'} Header={Header}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {CreateTeam}
      </Formik>
    </DashboardLayout>
  );
};
