import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { ContextMenuItem, ContextMenuItemProps } from './index';

const Template: Story<ContextMenuItemProps> = (args) => <ContextMenuItem {...args} />;
export const CMStories = Template.bind({});
CMStories.storyName = 'Normal';
CMStories.args = {
  children: <span>Home</span>,
};
CMStories.argTypes = {
  children: { control: null, type: 'string' },
};

export default {
  component: ContextMenuItem,
  decorators: [
    (Stories) => (
      <div style={{ background: '#27282b' }}>
        <Stories />
      </div>
    ),
  ],
  title: 'ContextMenuItem',
} as Meta;
