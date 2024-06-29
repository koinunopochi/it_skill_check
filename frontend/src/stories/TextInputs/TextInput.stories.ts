// TextInput.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import TextInput from './TextInput.vue';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'],
    },
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    id: 'input1',
    label: '入力フィールド',
    type: 'text',
    modelValue: '',
    placeholder: '入力してください',
  },
};

export const WithValue: Story = {
  args: {
    ...Default.args,
    modelValue: 'サンプルテキスト',
  },
};
