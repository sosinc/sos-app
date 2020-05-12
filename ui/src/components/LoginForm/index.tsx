import c from './style.module.scss';

const Login: React.FC = () => (
  <form className={c.loginForm}>
    <input className={c.input} type="text" placeholder="> enter your work email" />
    <button className={c.loginButton} type="button">
      Login
    </button>
  </form>
);

export default Login;
