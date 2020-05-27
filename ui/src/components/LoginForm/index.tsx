import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import Modal from 'src/components/Modal';
import ResetPassword from 'src/components/ResetPassword';
import hasFormError from 'src/lib/hasFormError';

import c from './style.module.scss';

const cx = classNames.bind(c);

const Login: React.FC<FormikProps<LoginFormValues>> = (props) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');
  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleModal = () => {
    setModalOpen(false);
  };

  const formHasError = hasFormError(props);

  return (
    <div className={cx('container')}>
      <div className={cx('login-form-container')}>
        <form
          className={cx('login-form', { 'has-error': formHasError })}
          onSubmit={props.handleSubmit}>
          <div className={cx('fields-container')}>
            <div className={cx('2-step-swiper', cx(formStep))}>
              <TextField
                className={cx('email')}
                placeholder="> enter your work email"
                type="email"
                name="email"
                onBlur={() => untouchStep2()}
              />
              <div className={cx('password')}>
                <span className={cx('back-icon')} onClick={gotoStep1} />
                <TextField placeholder="*******" type="password" name="password" />
              </div>
            </div>
          </div>

          <button className={c.loginButton} type="button" onClick={gotoNextStep}>
            Login
          </button>
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
