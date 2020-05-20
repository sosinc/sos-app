import { FormikProps, withFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import c from './style.module.scss';

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC<FormikProps<FormValues>> = (p) => {
  const [doEmailExist, setEmail] = useState(false);
  const [emailInputClass, setEmailInputClass] = useState<string>('');
  const [passwordInputClass, setPasswordInputClass] = useState<string>(c.hiddenFieldAtRight);

  const changeInputField = () => {
    if (p.values.email.length) {
      setEmailInputClass(c.swipeLeft);
      setPasswordInputClass('');
      setTimeout(() => {
        setEmail(true);
      }, 1000);
    }
  };

  const resetInputFields = () => {
    setEmailInputClass('');
    setPasswordInputClass(c.swipeRight);
    setEmail(false);
  };

  const inputClass = (type: 'email' | 'password') => {
    return p.errors[type] && p.touched[type] ? `${c.formError} ${c.input}` : c.input;
  };

  const errorMessage =
    p.touched.email && p.errors.email ? (
      <span className={c.validationMessage}>{p.errors.email}</span>
    ) : null;

  const errorMessagePassword =
    p.touched.password && p.errors.password ? (
      <span className={c.validationMessage}>{p.errors.password}</span>
    ) : null;

  const emailField = (
    <div className={`${c.inputFieldContainer} ${emailInputClass}`}>
      <input
        id="email"
        placeholder="enter your work email"
        {...p.getFieldProps('email')}
        className={`${inputClass('email')}`}
      />
      {errorMessage}
    </div>
  );

  const passwordField = (
    <div className={`${c.inputFieldContainer} ${passwordInputClass}`}>
      <input
        id="password"
        placeholder="enter your password"
        {...p.getFieldProps('password')}
        className={`${inputClass('password')}`}
      />
      {errorMessagePassword}
    </div>
  );

  const loginButton = doEmailExist ? (
    <button className={c.loginButton} type="submit">
      Login
    </button>
  ) : (
    <button className={c.loginButton} type="button" onClick={changeInputField}>
      Login
    </button>
  );

  return (
    <form className={c.loginForm} onSubmit={p.handleSubmit}>
      <div className={c.fieldsContainer}>
        <TextField type="email" name="email" placeholder="" />

        <span className={`${c.backToEmailField} ${passwordInputClass}`}>
          <button type="button" onClick={resetInputFields}>
            B
          </button>
          <TextField type="password" name="password" placeholder="" />
        </span>
      </div>
      {loginButton}
    </form>
  );
};

export default withFormik<{}, FormValues>({
  handleSubmit: (v, b) => {
    console.warn('SUBMITTING', v, b);
  },
  validationSchema: Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
  }),
})(Login);
