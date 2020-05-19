import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import c from './style.module.scss';

const Login: React.FC = () => {
  const [doEmailExist, setEmail] = useState(false);

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
      setEmail(true);
    }
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

  const emailField = !doEmailExist && (
    <div className={c.inputFieldContainer}>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="enter your work email"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.email}
        className={inputClass('email')}
      />
      {errorMessage}
    </div>
  );

  const passwordField = doEmailExist && (
    <div className={c.inputFieldContainer}>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="enter your password"
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        value={form.values.password}
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
    <form className={c.loginForm} onSubmit={form.handleSubmit}>
      {emailField}
      {passwordField}

      {loginButton}
    </form>
  );
};

export default Login;
