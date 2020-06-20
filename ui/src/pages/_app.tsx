import 'cross-fetch/polyfill';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FlashMessages from 'src/components/FlashMessages';
import { RootState } from 'src/duck';
import { hideFlashMessage } from 'src/duck/flashMessages';
import 'src/scss/global.scss';
import { wrapper } from 'src/store';

const App: React.FC<any> = ({ Component, pageProps }) => {
  const flashMessages = useSelector((state: RootState) => state.flashMessage.messages);
  const dispatch = useDispatch();

  return (
    <>
      <Component {...pageProps} />
      <FlashMessages messages={flashMessages} onClose={(id) => dispatch(hideFlashMessage(id))} />
    </>
  );
};

export default wrapper.withRedux(App);
