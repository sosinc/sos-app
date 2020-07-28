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
import { KeyboardEvent, MutableRefObject } from 'react';
import { GoGitPullRequest, GoIssueOpened } from 'react-icons/go';
import { MdAlarm, MdClose, MdKeyboardReturn } from 'react-icons/md';

import SelectField from 'src/components/Form/SelectField';
import { createDailyTaskAction, updateDailyTaskAction } from 'src/duck/tasks';
import { fetchDailyTasks } from 'src/duck/tasks';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk } from 'src/lib/asyncHooks';
import Header from './Header';
import style from './style.module.scss';

const c = classNames.bind(style);

interface NewTaskUpdate {
  description: string;
  estimated_hours?: number;
  issue_id?: any;
  pr_id?: any;
  project_id: string;
  title: string;
}

const estimations = [
  { id: '0.5', name: '30 Minutes' },
  { id: '1', name: '1 Hour' },
  { id: '2', name: '2 Hour' },
];

interface DailyTaskFormProps {
  onClose: () => void;
  /**
   * checks if form initial state is changed and if it is changed than show warnign popup
   */
  isDirtyRef: MutableRefObject<boolean>;
  value?: NewTaskUpdate[];
  taskId?: string;
}

interface DailyTaskFormValues {
  taskUpdates: NewTaskUpdate[];
}

const initialValues: DailyTaskFormValues = {
  taskUpdates: [
    {
      description: '',
      estimated_hours: 0,
      issue_id: '',
      pr_id: '',
      project_id: '',
      title: '',
    },
  ],
};

const TaskField: React.FC<{
  status: NewTaskUpdate;
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
            name={`${p.name}.issue_id`}
          />
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} title="Pr id" />
          <Field
            className={c('add-issue')}
            type={'text'}
            placeholder="PR"
            name={`${p.name}.pr_id`}
          />
        </div>

        <div className={c('add-status-item', 'select-field-container')}>
          <MdAlarm className={c('add-item-icon')} title="Estimation in hours" />
          <SelectField
            className={c('project-id-field')}
            name={`${p.name}.estimated_hours`}
            options={estimations}
            isDropdownIconHidden={true}
            isLogoHidden={true}
          />
        </div>

        <div className={c('add-status-item', 'select-field-container')}>
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

interface DailyTaskFieldsProps extends FieldArrayRenderProps {
  value: NewTaskUpdate[];
  taskId?: string;
}

const DailyTaskFields: React.FC<DailyTaskFieldsProps> = ({
  remove,
  unshift,
  value: taskUpdates,
  taskId: taskId,
}) => {
  const handleSaveStatus = () => {
    if (!taskId) {
      if (taskUpdates[0].title.trim()) {
        unshift({
          description: '',
          estimated_hours: 0,
          issue_id: '',
          pr_id: '',
          project_id: taskUpdates[0].project_id,
          title: '',
        });
      }
    }
  };

  const handleDelete = (index: number) => {
    if (!taskId) {
      remove(index);
    }
  };

  const StatusFields = taskUpdates.map((s, index) => (
    <TaskField
      key={index}
      name={`taskUpdates.${index}`}
      onDelete={index ? () => handleDelete(index) : undefined}
      onSave={handleSaveStatus}
      status={s}
    />
  ));

  return <>{StatusFields}</>;
};

const InnerForm: React.FC<FormikProps<DailyTaskFormValues> & DailyTaskFormProps> = (p) => {
  p.isDirtyRef.current = p.dirty;

  const dsfProps = (props: FieldArrayRenderProps): DailyTaskFieldsProps => ({
    ...props,
    taskId: p.taskId,
    value: p.values.taskUpdates,
  });

  return (
    <Form>
      <Header onClose={p.onClose} onSubmit={p.submitForm} />
      <FieldArray name="taskUpdates" render={(props) => DailyTaskFields(dsfProps(props))} />
    </Form>
  );
};

const AddDailyTasksForm: React.FC<DailyTaskFormProps> = (p) => {
  const [createDailyTask] = useAsyncThunk(createDailyTaskAction, {
    errorTitle: 'Failed to add Task',
    rethrowError: true,
    successTitle: 'Task added successfully',
  });

  const [updateDailyTask] = useAsyncThunk(updateDailyTaskAction, {
    errorTitle: 'Failed to update Task',
    rethrowError: true,
    successTitle: 'Task updated successfully',
  });

  const [getNewTasks] = useAsyncThunk(fetchDailyTasks, {
    errorTitle: 'Failed to fetch some Tasks',
  });
  const user = currentUser();
  const projectId = user.projects?.length && user.projects[0].id;

  if (!projectId) {
    throw new Error('You are not supposed to be here!');
  }

  let initialTaskUpdates = initialValues.taskUpdates.map((s) => ({
    ...s,
    project_id: projectId,
  }));

  if (p.value) {
    initialTaskUpdates = p.value;
  }

  const handleSubmit = async (
    values: DailyTaskFormValues,
    helpers: FormikHelpers<DailyTaskFormValues>,
  ) => {
    const filteredValues = values.taskUpdates.filter((v) => v.title);
    if (filteredValues.length) {
      if (p.value) {
        await updateDailyTask({ ...values.taskUpdates[0], id: p.taskId });
      } else {
        await createDailyTask(filteredValues);
      }
      helpers.resetForm();
      getNewTasks();
      p.onClose();
    }
  };

  const otherProps = { onClose: p.onClose, isDirtyRef: p.isDirtyRef, taskId: p.taskId };

  return (
    <>
      <Formik
        initialValues={{ ...initialValues, taskUpdates: initialTaskUpdates }}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => InnerForm({ ...otherProps, ...formikProps })}
      </Formik>
    </>
  );
};

export default AddDailyTasksForm;
