import React from 'react';
import { Provider } from 'react-redux';

import configureStore from 'src/configureStore';
import 'src/scss/global.scss';

const { store } = configureStore();

const App: React.FC<any> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
