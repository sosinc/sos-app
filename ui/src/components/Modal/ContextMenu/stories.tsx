import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import ContextMenu, { ContextMenuItem, ContextMenuProps, Separator } from './index';

const Template: Story<ContextMenuProps> = (args) => <ContextMenu {...args} />;
export const CMStories = Template.bind({});
CMStories.storyName = 'Open';
CMStories.args = {
  isOpen: true,
  items: [
    <ContextMenuItem key="0">
      <span>Home</span>
    </ContextMenuItem>,
    <ContextMenuItem key="1">
      <span>Profile</span>
    </ContextMenuItem>,
    <ContextMenuItem key="2">
      <span>Settings</span>
    </ContextMenuItem>,
    <Separator key="3" />,
    <ContextMenuItem key="4">
      <span>Logout</span>
    </ContextMenuItem>,
  ],
};
CMStories.argTypes = {
  items: {
    control: null,
    type: 'string',
  },
};

CMStories.parameters = {
  docs: {
    inlineStories: false,
  },
};

export default {
  component: ContextMenu,
  subcomponents: {
    ContextMenuItem,
    Separator,
  },
  title: 'ContextMenu',
} as Meta;
