import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { hideFlashMessage } from './duck';

import FlashMessage, { FlashMessageType } from './FlashMessage';

export interface FlashMessagesProps {
  /**
   * Array of `FlashMessage`s to show. Usually obtained from state.
   */
  messages: FlashMessageType[];
}

/**
 * Convinience wrapper to easily integrate FlashMessages in a React application.
 *
 * ## Usage
 * - Render `FlashMessages` component with appropriate styles (e.g fixed position at bottom right is popular)
 * - Add reducer exported by FlashMessage duck to your root reducer
 * - Use `useFlash` hook to show a flash message from anywhere in the application
 */
const FlashMessages: React.FC<FlashMessagesProps> = (p) => {
  const dispatch = useDispatch();
  const handleClose = useCallback(
    (id) => {
      dispatch(hideFlashMessage(id));
    },
    [dispatch],
  );
  const messages = p.messages.map((m) => <FlashMessage key={m.id} onClose={handleClose} {...m} />);

  return <>{messages}</>;
};

export default FlashMessages;
