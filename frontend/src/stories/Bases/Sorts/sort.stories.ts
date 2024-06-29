import type { Meta, StoryObj } from '@storybook/vue3';
import Sort from './Sort.vue';

const meta = {
  title: 'Components/Sort',
  component: Sort,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: {
        type: 'object',
      },
    },
    modelValue: {
      control: {
        type: 'object',
      },
    },
  },
} satisfies Meta<typeof Sort>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    modelValue: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
};

export const PreSorted: Story = {
  args: {
    options: ['Apple', 'Banana', 'Cherry', 'Date'],
    modelValue: ['Cherry', 'Apple', 'Date', 'Banana'],
  },
};

export const LongList: Story = {
  args: {
    options: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
      'Item 7',
      'Item 8',
      'Item 9',
      'Item 10',
    ],
    modelValue: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
      'Item 7',
      'Item 8',
      'Item 9',
      'Item 10',
    ],
  },
};

export const InteractionTest: Story = {
  args: {
    options: ['Red', 'Green', 'Blue', 'Yellow'],
    modelValue: ['Red', 'Green', 'Blue', 'Yellow'],
  },
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('select');
    if (!select) {
      throw new Error('Select element not found');
    }
    select.value = 'Yellow';
    select.dispatchEvent(new Event('change'));
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};
