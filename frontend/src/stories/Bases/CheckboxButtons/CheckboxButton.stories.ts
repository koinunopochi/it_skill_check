// CheckboxButton.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import CheckboxButton from './CheckboxButton.vue';

const meta: Meta<typeof CheckboxButton> = {
  title: 'Components/CheckboxButton',
  component: CheckboxButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    modelValue: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxButton>;

export const Default: Story = {
  args: {
    label: 'オプション1',
    value: 'option1',
    modelValue: false,
  },
};

export const Checked: Story = {
  args: {
    ...Default.args,
    modelValue: true,
  },
};
