import classNames from 'classnames/bind';
import { FieldInputProps, FieldMetaProps, useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import c from './style.module.scss';

const cx = classNames.bind(c);

const TextField: React.FC<{
  className?: string;
  placeholder?: string;
  type?: string;
  meta: FieldMetaProps<string>;
  field: FieldInputProps<string>;
}> = (p) => {
  const hasError = p.meta.touched && p.meta.error;
  const MaybeErrorMessage = () => {
    if (!hasError) {
      return null;
    }

    return <span className={cx('error-icon')} title={p.meta.error} />;
  };

  const containerClass = cx('input-field-container', p.className, {
    'has-error': hasError,
  });

  return (
    <div className={containerClass}>
      <input type={p.type || 'text'} placeholder={p.placeholder} {...p.field} />

      <MaybeErrorMessage />
    </div>
  );
};

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');

  const form = useFormik<LoginFormValues>({
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

    onSubmit: (values) => {
      console.warn('SUBMITTING', values);
    },
  });

  const gotoStep2 = () => {
    setFormStep('step2');
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

  return (
    <form className={cx('login-form', { 'has-error': !form.isValid })} onSubmit={form.handleSubmit}>
      <div className={cx('fields-container')}>
        <div className={cx('2-step-swiper', cx(formStep))}>
          <TextField
            className={cx('email')}
            placeholder="> enter your work email"
            type="email"
            meta={form.getFieldMeta('email')}
            field={form.getFieldProps('email')}
          />

          <div className={cx('password')}>
            <span className={cx('back-icon')} onClick={gotoStep1} />

            <TextField
              className={``}
              placeholder="*******"
              type="password"
              field={form.getFieldProps('password')}
              meta={form.getFieldMeta('password')}
            />
          </div>
        </div>
      </div>

      {loginButton}
    </form>
  );
};

export default Login;
