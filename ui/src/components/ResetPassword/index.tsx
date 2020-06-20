import classNames from 'classnames/bind';
import { Formik, FormikProps } from 'formik';
import { useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
// import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import style from './style.module.scss';

const c = classNames.bind(style);

const ResetPassword: React.FC<FormikProps<ResetFormValues> & Pick<Props, 'onSendOtp'>> = (p) => {
  const [formStep, setFormStep] = useState<'step1' | 'step2'>('step1');
  /*
   * Field in step2 need to be marked untouch by hand for some reason.
   * Otherwise formik says step2 is invalid even when the user hasn't even
   * seen that field yet. Use this function mark fields in  step2 as valid
   * when it makes sense.
   */
  const untouchStep2 = () => {
    p.setTouched({ password: false });
  };

  const gotoNextStep = async () => {
    // Cannot use validateField because of formik issue: https://github.com/jaredpalmer/formik/issues/2291
    if (formStep === 'step1' && p.values.email.length && !p.errors.email) {
      p.setSubmitting(true);
      try {
        await p.onSendOtp(p.values.email);

        setFormStep('step2');
        untouchStep2();
      } catch (err) {
        // pass
      } finally {
        p.setSubmitting(false);
      }
    }

    if (formStep === 'step2') {
      p.submitForm();
    }
  };

  const gotoStep1 = () => {
    setFormStep('step1');
    untouchStep2();
  };

  const otpMessage =
    'We will send you a otp to verify your email account and fill the otp and your new password';

  const buttonText =
    formStep === 'step2'
      ? p.isSubmitting
        ? 'Resetting Password'
        : 'Reset Password'
      : p.isSubmitting
        ? 'Sending OTP'
        : 'Send OTP';

  return (
    <>
      <form className={c('form', c(formStep))} onSubmit={p.handleSubmit}>
        <div className={c('fields-container')}>
          <div>
            <h2 className={c('form-title')}>Reset Password</h2>
            <p className={c('form-text')}> {otpMessage} </p>
          </div>

          <div className={c('2-step-swiper', c(formStep))}>
            <TextField placeholder="Enter your registered email" type="email" name="email" />

            <div className={c('password-container')}>
              <div className={c('password-fields')}>
                <TextField placeholder="OTP" type="text" name="otp" tabIndex={1} />
                <TextField
                  placeholder="Enter new password"
                  type="password"
                  name="password"
                  tabIndex={2}
                />
              </div>
            </div>
          </div>
        </div>

        <FaAngleLeft title="Back" className={c('back-icon', formStep)} onClick={gotoStep1} />
      </form>
      <button
        className={c('button', { working: p.isSubmitting })}
        type="button"
        onClick={gotoNextStep}
        disabled={p.isSubmitting}
      >
        {buttonText}
        <span />
      </button>
    </>
  );
};

interface ResetFormValues {
  email: string;
  password: string;
  otp: string;
}

const initialValues = {
  email: '',
  otp: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  otp: Yup.string().min(4, 'Must be 4 or more').required('Required'),
  password: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
});

interface Props {
  onSubmit: (values: ResetFormValues) => void;
  onSendOtp: (email: string) => Promise<void>;
}

const ResetPasswordForm: React.FC<Props> = (p) => {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={p.onSubmit}>
      {(formikProps) => ResetPassword({ ...formikProps, onSendOtp: p.onSendOtp })}
    </Formik>
  );
};

export default ResetPasswordForm;
