import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';

import TextAreaField from 'src/components/Form/TextAreaField';
import TextField from 'src/components/Form/TextField';
import config from 'src/config';
import { useFlash } from 'src/duck/flashMessages';
import style from './style.module.scss';

const c = classNames.bind(style);

const FeedbackForm: React.FC<FormikProps<FeedbackFormValues>> = (p) => {
  return (
    <div className={c('container')}>
      <form className={c('form')} onSubmit={p.handleSubmit}>
        <div className={c('title-container')}>
          <h2>Feedback</h2>
          <span className={c('sub-title')}>
            Send your complaints, suggestions, or feature requests
          </span>
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

        <div className={c('description-container', 'field-container')}>
          <span className={c('field-title')}>Description</span>
          <TextAreaField name="description" placeholder="Enter description" rows={6} />
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
  description: string;
  email: string;
  first_name: string;
  last_name: string;
}

const validationSchema = Yup.object().shape({
  description: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(500, 'Must be 500 characters or less')
    .trim()
    .required('Required'),
  email: Yup.string().email().required('Required'),
  first_name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(50, 'Must be 50 characters or less')
    .trim()
    .required('Required'),
  last_name: Yup.string().max(50, 'Must be 50 characters or less').trim(),
});

const initialValues = {
  description: '',
  email: '',
  first_name: '',
  last_name: '',
};

const OuterForm: React.FC<{ onClose: () => void }> = (p) => {
  const [flash] = useFlash();

  const handleSubmit = async (
    values: FeedbackFormValues,
    helpers: FormikHelpers<FeedbackFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('firstName', values.first_name);
      formData.append('lastName', values.last_name);
      formData.append('description', values.description);

      await fetch(config.urls.feedbackForm, {
        body: formData,
        headers: {
          accept: 'application/json',
        },
        method: 'POST',
      });

      helpers.resetForm();
      p.onClose();

      flash({
        title: 'Feedback is sent successfully',
        type: 'success',
      });
    } catch (err) {
      flash({
        title: 'Something went wrong :-(',
        type: 'error',
      });
    }
    helpers.setSubmitting(false);
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
