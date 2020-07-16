import classNames from 'classnames/bind';
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { KeyboardEvent } from 'react';
import { GoGitPullRequest, GoIssueOpened } from 'react-icons/go';
import { MdAlarm, MdClose, MdKeyboardReturn } from 'react-icons/md';

import SelectField from 'src/components/Form/SelectField';
import { createDaliyStatusAction } from 'src/duck/auth';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk } from 'src/lib/asyncHooks';
import Header from './Header';
import style from './style.module.scss';

const c = classNames.bind(style);

interface NewStatusUpdate {
  description: string;
  estimated_hours?: number;
  issue_id?: any;
  pr_id?: any;
  project_id: string;
  title: string;
}

interface DailyStatusFormValues {
  statusUpdates: NewStatusUpdate[];
}

const initialValues: DailyStatusFormValues = {
  statusUpdates: [
    {
      description: '',
      estimated_hours: 0,
      issue_id: null,
      pr_id: null,
      project_id: '',
      title: '',
    },
  ],
};

const StatusField: React.FC<{
  status: NewStatusUpdate;
  name: string;
  onSave: () => void;
  onDelete?: () => void;
}> = (p) => {
  const user = currentUser();
  const userProjects = user.projects ? user.projects : [];
  const projects = userProjects.map((i) => ({ id: i.id, name: i.name, logo: i.logo_square }));
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      p.onSave();
    }
  };

  return (
    <div className={c('add-status-body')}>
      <div className={c('add-status-row')}>
        <Field
          className={c('add-status')}
          type={'text'}
          name={`${p.name}.title`}
          onKeyDown={handleKeyDown}
          placeholder="Status"
        />
        <span className={c('input-action-container')}>
          {!p.onDelete && <MdKeyboardReturn onClick={p.onSave} />}
          {p.onDelete && <MdClose onClick={p.onDelete} />}
        </span>
      </div>

      <div className={c('add-row-items')}>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} title="Issue id" />
          <Field
            className={c('add-issue')}
            type={'text'}
            placeholder="Issue"
            name={`${p.name}.issue_Id`}
          />
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} title="Pr id" />
          <Field
            className={c('add-issue')}
            type={'text'}
            placeholder="PR"
            name={`${p.name}.pr_Id`}
          />
        </div>

        <div className={c('add-status-item')}>
          <MdAlarm className={c('add-item-icon')} title="Estimated should be in hours" />
          <Field
            className={c('add-issue')}
            type={'text'}
            placeholder="Estimation"
            name={`${p.name}.estimated_hours`}
          />
        </div>

        <div className={c('add-status-item', 'projct-container')}>
          <SelectField
            className={c('project-id-field')}
            name={`${p.name}.project_id`}
            options={projects}
            isLoading={false}
            isDropdownIconHidden={true}
          />
        </div>
      </div>
    </div>
  );
};

const DailyStatusFields: React.FC<FieldArrayRenderProps & { value: NewStatusUpdate[] }> = ({
  remove,
  unshift,
  value: statusUpdates,
}) => {
  const handleSaveStatus = () => {
    if (statusUpdates[0].title.trim()) {
      unshift({
        description: '',
        estimated_hours: 0,
        issue_id: null,
        pr_id: null,
        project_id: '',
        title: '',
      });
    }
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  const StatusFields = statusUpdates.map((s, index) => (
    <StatusField
      key={index}
      name={`statusUpdates.${index}`}
      onDelete={index ? () => handleDelete(index) : undefined}
      onSave={handleSaveStatus}
      status={s}
    />
  ));

  return <>{StatusFields}</>;
};

const InnerForm: React.FC<FormikProps<DailyStatusFormValues> & { onClose: () => void }> = (p) => (
  <Form>
    <Header onClose={p.onClose} onSubmit={p.submitForm} />

    <FieldArray
      name="statusUpdates"
      render={(props) => DailyStatusFields({ ...props, value: p.values.statusUpdates })}
    />
  </Form>
);

const FieldArr: React.FC<{ onClose: () => void }> = (p) => {
  const [createDailyStatus] = useAsyncThunk(createDaliyStatusAction, {
    errorTitle: 'Failed to add statuss',
    rethrowError: true,
    successTitle: 'status added successfully',
  });
  const user = currentUser();
  const projectId = user.projects?.length && user.projects[0].id;

  if (!projectId) {
    throw new Error('You are not supposed to be here!');
  }

  const initialStatusUpdates = initialValues.statusUpdates.map((s) => ({
    ...s,
    project_id: projectId,
  }));

  const handleSubmit = async (
    values: DailyStatusFormValues,
    helpers: FormikHelpers<DailyStatusFormValues>,
  ) => {
    const filteredValues = values.statusUpdates.filter((v) => v.title);
    await createDailyStatus(filteredValues);
    helpers.resetForm();
  };

  return (
    <>
      <Formik
        initialValues={{ ...initialValues, statusUpdates: initialStatusUpdates }}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => InnerForm({ onClose: p.onClose, ...formikProps })}
      </Formik>
    </>
  );
};

export default FieldArr;
