import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import flashMessages from './duck';
import { FlashMessageProps } from './FlashMessage';
import { Success as FlashMessageStory } from './FlashMessage/stories';
import FlashMessages, { FlashMessagesProps as FlashMessageListProps } from './index';

const Template: Story<FlashMessageListProps> = (args) => <FlashMessages {...args} />;
export const FMStories = Template.bind({});
FMStories.storyName = 'FlashMessages';
FMStories.args = {
  messages: [FlashMessageStory.args as FlashMessageProps],
};

const store = configureStore({
  reducer: () => ({
    flashMessages: flashMessages.reducer,
  }),
});

export default {
  component: FlashMessages,
  decorators: [
    (Stories) => (
      <Provider store={store}>
        <Stories />
      </Provider>
    ),
  ],
  title: 'FlashMessages',
} as Meta;
