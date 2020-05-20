import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import c from './style.module.scss';

const Login: React.FC = () => {
  const [doEmailExist, setEmail] = useState(false);
  const [emailInputClass, setEmailInputClass] = useState<string>('');
  const [passwordInputClass, setPasswordInputClass] = useState<string>(c.hiddenFieldAtRight);

  const form = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    }),

    onSubmit: () => {
      setEmail(true);
    },
  });

  const changeInputField = () => {
    if (form.values.email.length) {
      setEmailInputClass(c.swipeLeft);
      setPasswordInputClass('');
      setEmail(true);
      // setTimeout(() => {
      // setEmail(true);
      // }, 3000);
    }
  };

  const resetInputFields = () => {
    setEmailInputClass('');
    setPasswordInputClass(c.swipeRight);
    setEmail(false);
  };

  const inputClass = (type: 'email' | 'password') => {
    return form.errors[type] && form.touched[type] ? `${c.formError} ${c.input}` : c.input;
  };

  const errorMessage =
    form.touched.email && form.errors.email ? (
      <span className={c.validationMessage}>{form.errors.email}</span>
    ) : null;

  const errorMessagePassword =
    form.touched.password && form.errors.password ? (
      <span className={c.validationMessage}>{form.errors.password}</span>
    ) : null;

  const emailField = (
    <div className={`${c.inputFieldContainer} ${emailInputClass}`}>
      <input
        id="email"
        placeholder="enter your work email"
        {...form.getFieldProps('email')}
        className={`${inputClass('email')}`}
      />
      {errorMessage}
    </div>
  );

  const passwordField = (
    <span className={`${c.backToEmailField} ${passwordInputClass}`}>
      <span className={c.arrowIconContainer} onClick={resetInputFields}>
        <img className={c.arrowIcon} src="/assets/images/leftArrow.svg" alt="back" />
      </span>

      <div className={`${c.inputFieldContainer}`}>
        <input
          id="password"
          placeholder="enter your password"
          {...form.getFieldProps('password')}
          className={`${inputClass('password')}`}
        />
        {errorMessagePassword}
      </div>
    </span>
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
    <form className={c.loginForm} onSubmit={form.handleSubmit}>
      <div className={c.fieldsContainer}>
        {emailField}
        {passwordField}
      </div>
      {loginButton}
    </form>
  );
};

export default Login;
