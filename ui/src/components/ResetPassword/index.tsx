import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import hasFormError from 'src/lib/hasFormError';
import style from './style.module.scss';

const c = classNames.bind(style);

const ResetPassword: React.FC<FormikProps<LoginFormValues>> = (props) => {
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
    if (formStep === 'step1' && props.values.email && !props.errors.email) {
      setFormStep('step2');
      untouchStep2();

      return;
    }

    props.submitForm();
  };

  const gotoStep1 = () => {
    setFormStep('step1');
    untouchStep2();
  };

  const otpMessage =
    'We will send you a otp to verify your email account and fill the otp and your new password';

  const formHasError = hasFormError(props);

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
              className={c('email', { 'has-error': formHasError })}
              placeholder="> enter your registered email"
              type="email"
              name="email"
              onBlur={() => untouchStep2()}
            />

            <div className={c('password-container')}>
              <div className={c('back-icon')} onClick={gotoStep1} />

              <div className={c('password-fields')}>
                <TextField
                  placeholder="OTP"
                  type="text"
                  name="otp"
                  className={c('email', { 'has-error': formHasError })}
                />
                <TextField
                  placeholder="> enter new password"
                  type="password"
                  name="password"
                  className={c('email', { 'has-error': formHasError })}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <button className={c('loginButton')} type="button" onClick={gotoNextStep}>
        {formStep === 'step2' ? 'Reset' : 'Send OTP'}
      </button>
    </>
  );
};

interface LoginFormValues {
  email: string;
  password: string;
  otp: string;
}

export default withFormik<{}, LoginFormValues>({
  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    otp: Yup.string()
      .min(4, 'Must be 4 or more')
      .required('Required'),
    password: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
  }),

  handleSubmit: (values, bag) => {
    console.warn('SUBMITTING', values, bag);
  },
})(ResetPassword);
