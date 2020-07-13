import classNames from 'classnames/bind';
import { FieldArray, FieldArrayRenderProps, Form, Formik } from 'formik';
import { KeyboardEvent } from 'react';
import { GoGitPullRequest, GoIssueOpened } from 'react-icons/go';
import { MdKeyboardReturn } from 'react-icons/md';

import FallbackIcon from 'src/containers/FallbackIcon';
import style from './style.module.scss';

const c = classNames.bind(style);

/* interface DailyStatusFieldProps {
 *   name: string;
 *   className?: string;
 *   inputClassName?: string;
 *   placeholder?: string;
 * }
 *  */

interface NewStatusUpdate {
  issue?: string;
  pr?: string;
  status: string;
  employeeId: string;
}

interface DailyStatusFormValues {
  statusUpdates: NewStatusUpdate[];
}

const initialValues = {
  statusUpdates: [
    {
      employeeId: '',
      issue: '',
      pr: '',
      status: '',
    },
  ],
};

const StatusField: React.FC<{
  status: NewStatusUpdate;
  name: string;
  onSave: () => void;
  onDelete: () => void;
}> = (p) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      p.onSave();
    }
  };

  return (
    <div className={c('add-status-body')}>
      <div className={c('add-status-row')}>
        <input
          className={c('add-status')}
          type={'text'}
          name={`${p.name}.status`}
          onKeyDown={handleKeyDown}
          placeholder="Status"
        />
        <span className={c('enter-icon-container')} onClick={p.onSave}>
          <MdKeyboardReturn />
        </span>
      </div>
      <div className={c('add-row-items')}>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} />
          <input
            className={c('add-issue')}
            type={'text'}
            placeholder="Issue"
            name={`${name}.issue`}
          />
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} />
          <input className={c('add-issue')} type={'text'} placeholder="PR" name={`${name}.pr`} />
        </div>
        <div className={c('add-status-item', 'add-status-user')}>
          <span className={c('add-item-icon')}>
            <FallbackIcon logo={''} name={''} />
          </span>
          <span className={c('add-item-text')}>{''}</span>
        </div>
      </div>

      <div className="col">
        <button type="button" className="secondary" onClick={p.onDelete}>
          X
        </button>
      </div>
    </div>
  );
};

const DailyStatusFields: React.FC<FieldArrayRenderProps & { value: NewStatusUpdate[] }> = ({
  remove,
  push,
  value: statusUpdates,
}) => {
  const handleSaveStatus = () => {
    push({ status: '', pr: '', issue: '', employeeId: '' });
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  const StatusFields = statusUpdates.map((s, index) =>
    StatusField({
      name: `statusUpdates.${index}`,
      onDelete: () => handleDelete(index),
      onSave: handleSaveStatus,
      status: s,
    }),
  );

  return <>{StatusFields}</>;
};

const FieldArr = () => {
  const handleSubmit = (values: DailyStatusFormValues) => {
    console.warn('------values--------', values);
  };

  const StatusFields = ({ values }: { values: DailyStatusFormValues }) => (
    <Form>
      <FieldArray
        name="statusUpdates"
        render={(props) => DailyStatusFields({ ...props, value: values.statusUpdates })}
      />
      <button type="submit">Submit</button>
    </Form>
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {StatusFields}
    </Formik>
  );
};

export default FieldArr;
