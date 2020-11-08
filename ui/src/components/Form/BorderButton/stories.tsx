import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import Button, { ButtonProps } from './index';

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}>
    <span style={{ padding: '3px' }}>B</span>
  </Button>
);
export const CMStories = Template.bind({});
CMStories.storyName = 'Button';

CMStories.args = {
  hasNoUpArrow: false,
};
CMStories.argTypes = {
  children: {
    control: null,
    type: 'string',
  },
  hasNoUpArrow: {
    defaultValue: { summary: false },
    description: 'If user want to show down icon',
  },
};

CMStories.parameters = {
  docs: {
    inlineStories: false,
  },
};

export default {
  component: Button,
  title: 'BorderButton',
} as Meta;
