import 'cross-fetch/polyfill';
import React from 'react';

import 'src/scss/global.scss';
import { wrapper } from 'src/store';

const App: React.FC<any> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default wrapper.withRedux(App);
