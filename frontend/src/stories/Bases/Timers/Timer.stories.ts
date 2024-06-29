import type { Meta, StoryObj } from '@storybook/vue3';
import Timer from './Timer.vue';

const meta = {
  title: 'Components/Timer',
  component: Timer,
  tags: ['autodocs'],
  argTypes: {
    duration: { control: 'number' },
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    duration: 1800, // 30 minutes
  },
};

export const ShortDuration: Story = {
  args: {
    duration: 180, // 3 minutes
  },
};

export const LongDuration: Story = {
  args: {
    duration: 7200, // 2 hours
  },
};
