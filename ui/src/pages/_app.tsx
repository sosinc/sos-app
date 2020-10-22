import 'cross-fetch/polyfill';
import React from 'react';
import { useSelector } from 'react-redux';

import FlashMessages from 'src/components/FlashMessages';
import { RootState } from 'src/duck';
import 'src/scss/global.scss';
import { wrapper } from 'src/store';
import 'tippy.js/dist/tippy.css';

const App: React.FC<any> = ({ Component, pageProps }) => {
  const flashMessages = useSelector((state: RootState) => state.flashMessage.messages);

  return (
    <>
      <Component {...pageProps} />
      <div className="flash-messages-portal">
        <FlashMessages messages={flashMessages} />
      </div>
    </>
  );
};

export default wrapper.withRedux(App);
