// RadioButton.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import RadioButton from './RadioButton.vue';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    modelValue: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
  args: {
    label: 'オプション1',
    value: 'option1',
    name: 'radioGroup',
    modelValue: '',
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    modelValue: 'option1',
  },
};
