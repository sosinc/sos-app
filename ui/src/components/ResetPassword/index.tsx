import classNames from 'classnames/bind';
import { Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import style from './style.module.scss';

const c = classNames.bind(style);

const ResetPassword: React.FC<FormikProps<ResetFormValues>> = (props) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');

  /*
   * Field in step2 need to be marked untouch by hand for some reason.
   * Otherwise formik says step2 is invalid even when the user hasn't even
   * seen that field yet. Use this function mark fields in  step2 as valid
   * when it makes sense.
   */
  const untouchStep2 = () => {
    props.setTouched({ password: false });
  };

  const gotoNextStep = () => {
    // Cannot use validateField because of formik issue: https://github.com/jaredpalmer/formik/issues/2291
    if (formStep === 'step1' && props.values.email.length && !props.errors.email) {
      setFormStep('step2');
      untouchStep2();
      return;
    }

    props.handleSubmit();
  };

  const gotoStep1 = () => {
    setFormStep('step1');
    untouchStep2();
  };

  const otpMessage =
    'We will send you a otp to verify your email account and fill the otp and your new password';

  return (
    <>
      <form className={c('login-form', c(formStep))} onSubmit={props.handleSubmit}>
        <div className={c('fields-container')}>
          <div>
            <h2 className={c('form-title')}>Reset Password</h2>
            <p className={c('form-text')}> {otpMessage} </p>
          </div>

          <div className={c('2-step-swiper', c(formStep))}>
            <TextField
              placeholder="Enter your registered email"
              type="email"
              name="email"
              className={'org-add-form'}
            />

            <div className={c('password-container')}>
              <FaAngleLeft title="Back" className={c('back-icon')} onClick={gotoStep1} />
              <div className={c('password-fields')}>
                <TextField
                  placeholder="OTP"
                  type="text"
                  name="otp"
                  className={'org-add-form'}
                  tabIndex={1}
                />
                <TextField
                  placeholder="Enter new password"
                  type="password"
                  name="password"
                  className={'org-add-form'}
                  tabIndex={2}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <button className={c('login-button')} type="button" onClick={gotoNextStep}>
        {formStep === 'step2' ? 'Reset' : 'Send OTP'}
      </button>
    </>
  );
};

interface ResetFormValues {
  email: string;
  password: string;
  otp: string;
}

const handleSubmit = (values: object, actions: object) => {
  console.warn('SUBMITTING', values, actions);
};

const initialValues = {
  email: '',
  otp: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  otp: Yup.string()
    .min(4, 'Must be 4 or more')
    .required('Required'),
  password: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),
});

export default () => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
    {ResetPassword}
  </Formik>
);
