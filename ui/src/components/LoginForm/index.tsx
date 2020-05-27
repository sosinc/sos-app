import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from '../Form/TextField';
import c from './style.module.scss';

import Modal from '../Modal';
import ResetPassword from '../ResetPassword';

const cx = classNames.bind(c);

const Login: React.FC<FormikProps<LoginFormValues>> = (props) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');
  const [isModalOpen, setModalOpen] = useState(false);

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

  const loginButton =
    formStep === 'step2' ? (
      <button className={c.loginButton} type="submit">
        Login
      </button>
    ) : (
        <button className={c.loginButton} type="button" onClick={gotoStep2}>
          Login
        </button>
      );

  const handleModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={cx('container')}>
      <div className={cx('login-form-container')}>
        <form
          className={cx('login-form', { 'has-error': !props.isValid })}
          onSubmit={props.handleSubmit}>
          <div className={cx('fields-container')}>
            <div className={cx('2-step-swiper', cx(formStep))}>
              <TextField
                className={cx('email')}
                placeholder="> enter your work email"
                type="email"
                name="email"
              />
              <div className={cx('password')}>
                <span className={cx('back-icon')} onClick={gotoStep1} />
                <TextField placeholder="*******" type="password" name="password" />
              </div>
            </div>
          </div>
          {loginButton}
        </form>
        <p className={cx('reset-password-text')} onClick={() => setModalOpen(true)}>
          Reset password
        </p>
      </div>
      <Modal onClose={handleModal} isOpen={isModalOpen}>
        <ResetPassword />
      </Modal>
    </div>
  );
};

interface LoginFormValues {
  email: string;
  password: string;
}

export default withFormik<{}, LoginFormValues>({
  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
  }),

  handleSubmit: (values, bag) => {
    console.warn('SUBMITTING', values, bag);
  },
})(Login);
