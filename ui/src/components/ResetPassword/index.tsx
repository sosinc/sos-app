import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from '../Form/TextField';
import style from './style.module.scss';

const c = classNames.bind(style);

const ResetPassword: React.FC<FormikProps<LoginFormValues>> = (props) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');

  const gotoStep2 = () => {
    try {
      if (props.values.email && !props.errors.email) {
        setFormStep('step2');
      }
      props.handleSubmit();
      // props.validateField('email');
    } catch (err) {
      console.warn('FORMIK ERR', err);
    }
  };

  const gotoStep1 = () => {
    setFormStep('step1');
  };

  const resetPasswordButton =
    formStep === 'step2' ? (
      <button className={style.loginButton} type="submit">
        Reset
      </button>
    ) : (
        <button className={style.loginButton} type="button" onClick={gotoStep2}>
          Send OTP
        </button>
      );

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
              className={c('email', { 'has-error': !props.isValid })}
              placeholder="> enter your registered email"
              type="email"
              name="email"
            />

            <div className={c('password-container')}>
              <div className={c('back-icon')} onClick={gotoStep1} />

              <div className={c('password-fields')}>
                <TextField
                  placeholder="OTP"
                  type="text"
                  name="otp"
                  className={c('email', { 'has-error': !props.isValid })}
                />
                <TextField
                  placeholder="> enter new password"
                  type="password"
                  name="password"
                  className={c('email', { 'has-error': !props.isValid })}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      {resetPasswordButton}
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
