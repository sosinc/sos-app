import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';

import TextAreaField from 'src/components/Form/TextAreaField';
import TextField from 'src/components/Form/TextField';
import style from './style.module.scss';

const c = classNames.bind(style);

const FeedbackForm: React.FC<FormikProps<FeedbackFormValues>> = (p) => {
  return (
    <div className={c('container')}>
      <form className={c('form')} onSubmit={p.handleSubmit}>
        <div className={c('title-container')}>
          <h2>Feedback</h2>
          <span className={c('sub-title')}>Tell Us About Your Feedback</span>
        </div>

        <div className={c('email-container', 'field-container')}>
          <span className={c('field-title')}>Email</span>
          <TextField placeholder="Enter email" type="email" name="email" />
        </div>

        <div className={c('first-name', 'field-container')}>
          <span className={c('field-title')}>First Name</span>
          <TextField placeholder="Enter first name" type="name" name="first_name" />
        </div>

        <div className={c('last-name', 'field-container')}>
          <span className={c('field-title')}>Last Name</span>
          <TextField placeholder="Enter last name" type="name" name="last_name" />
        </div>

        <div className={c('feedback-container', 'field-container')}>
          <span className={c('field-title')}>Description</span>
          <TextAreaField name="feedback" placeholder="Enter description" rows={6} />
        </div>

        <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
          <div className={c({ 'saving-in': p.isSubmitting })}>
            {p.isSubmitting ? 'Sending' : 'Send'}
            <span />
          </div>
        </button>
      </form>
    </div>
  );
};

// ---

export interface FeedbackFormValues {
  email: string;
  first_name: string;
  last_name: string;
  feedback: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('Required'),
  feedback: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(50, 'Must be 50 characters or less')
    .trim()
    .required('Required'),
  first_name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(50, 'Must be 50 characters or less')
    .trim()
    .required('Required'),
  last_name: Yup.string()
    .min(5, 'Must be 2 characters or more')
    .max(50, 'Must be 50 characters or less')
    .trim(),
});

interface OuterFormProps {
  onSubmit: (
    values: FeedbackFormValues,
    helpers: FormikHelpers<FeedbackFormValues>,
  ) => Promise<void>;
}

const initialValues = {
  email: '',
  feedback: '',
  first_name: '',
  last_name: '',
};

const OuterForm: React.FC<OuterFormProps> = (p) => {
  const handleSubmit = async (
    values: FeedbackFormValues,
    helpers: FormikHelpers<FeedbackFormValues>,
  ) => {
    console.warn('-------------values-----', values, helpers);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => FeedbackForm({ ...formikProps })}
      </Formik>
    </>
  );
};

export default OuterForm;
