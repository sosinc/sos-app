import classNames from 'classnames/bind';
import { Formik, FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import hasFormError from 'src/lib/hasFormError';

import style from './style.module.scss';

const c = classNames.bind(style);

const Login: React.FC<FormikProps<LoginFormValues> & { onResetPassword: () => void }> = (p) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');
  const passwordRef = useRef<HTMLInputElement>(null);

  /*
   * Field in step2 need to be marked untouch by hand for some reason.
   * Otherwise formik says step2 is invalid even when the user hasn't even
   * seen that field yet. Use this function mark fields in  step2 as valid
   * when it makes sense.
   */
  const untouchStep2 = () => {
    p.setTouched({ password: false });
  };

  const gotoNextStep = () => {
    // Cannot use validateField because of formik issue: https://github.com/jaredpalmer/formik/issues/2291
    if (formStep === 'step1' && p.values.email && !p.errors.email) {
      setFormStep('step2');
      untouchStep2();

      if (passwordRef.current) {
        passwordRef.current.focus();
      }

      return;
    }

    p.submitForm();
  };

  const gotoStep1 = () => {
    setFormStep('step1');
    untouchStep2();
  };

  const formHasError = hasFormError(p);

  const buttonText = p.isSubmitting ? (
    <div className={c({ 'logging-in': p.isSubmitting })}>
      Logging in
      <span />
    </div>
  ) : (
    'Login'
  );

  return (
    <div className={c('container')}>
      <div className={c('login-form-container')}>
        <form className={c('login-form', { 'has-error': formHasError })} onSubmit={p.handleSubmit}>
          <div className={c('fields-container')}>
            <div className={c('2-step-swiper', c(formStep))}>
              <TextField
                className={c('login-form-field')}
                placeholder="> enter your work email"
                type="email"
                name="email"
              />
              <div className={c('password')}>
                <FaAngleLeft title="Back" className={c('back-icon')} onClick={gotoStep1} />
                <TextField
                  className={c('login-form-field')}
                  inputRef={passwordRef}
                  placeholder="*******"
                  type="password"
                  name="password"
                  tabIndex={1}
                />
              </div>
            </div>
          </div>

          <button
            className={c('login-button')}
            type="button"
            onClick={gotoNextStep}
            disabled={p.isSubmitting}
          >
            {buttonText}
          </button>
        </form>
        <div className={c('reset-password-text')}>
          <span onClick={p.onResetPassword}>Reset password</span>
        </div>
      </div>
    </div>
  );
};

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
});

const initialValues = {
  email: '',
  password: '',
};

interface LoginProps {
  onSubmit: (values: LoginFormValues) => void;
  onResetPassword: () => void;
}

const OuterForm: React.FC<LoginProps> = (p) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={p.onSubmit}>
      {(formikProps) => Login({ ...formikProps, onResetPassword: p.onResetPassword })}
    </Formik>
  );
};

export default OuterForm;
