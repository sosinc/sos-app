import 'cross-fetch/polyfill';
import React from 'react';
import { useSelector } from 'react-redux';

import FlashMessages from 'src/components/FlashMessages';
import { RootState } from 'src/duck';
import { useFlash } from 'src/duck/flashMessages';
import 'src/scss/global.scss';
import { wrapper } from 'src/store';
import 'tippy.js/dist/tippy.css';

const App: React.FC<any> = ({ Component, pageProps }) => {
  const flashMessages = useSelector((state: RootState) => state.flashMessage.messages);
  // nifty little trick to access second value of array
  const [, unflash] = useFlash();

  return (
    <>
      <Component {...pageProps} />
      <FlashMessages messages={flashMessages} onClose={unflash} />
    </>
  );
};

export default wrapper.withRedux(App);
