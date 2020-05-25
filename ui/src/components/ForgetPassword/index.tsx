import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from '../Form/TextField';
import c from './style.module.scss';

const cx = classNames.bind(c);

const ForgetPassword: React.FC<FormikProps<LoginFormValues>> = (props) => {
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
      <button className={c.loginButton} type="submit">
        Reset
      </button>
    ) : (
      <button className={c.loginButton} type="button" onClick={gotoStep2}>
        Send OTP
      </button>
    );

  return (
    <form
      className={cx('login-form', { 'has-error': !props.isValid })}
      onSubmit={props.handleSubmit}>
      <div className={cx('fields-container')}>
        <div className={cx('2-step-swiper', cx(formStep))}>
          <TextField
            className={cx('email')}
            placeholder="> enter your registered email"
            type="email"
            name="email"
          />

          <div className={cx('password')}>
            <span className={cx('back-icon')} onClick={gotoStep1} />

            <TextField placeholder="otp" type="text" name="otp" />
            <TextField placeholder="> enter new password" type="password" name="password" />
          </div>
        </div>
      </div>

      <div className={cx('button-container')}>{resetPasswordButton}</div>
    </form>
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
})(ForgetPassword);
