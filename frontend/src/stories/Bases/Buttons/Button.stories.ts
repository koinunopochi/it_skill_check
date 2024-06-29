import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
import Button from './Button.vue';

// ストーリーの設定方法についての詳細: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Button',
  component: Button,
  // このコンポーネントは自動生成されたドキュメントページを持ちます: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
  },
  args: {
    primary: false,
    // アクションパネルに表示される onClick 引数をスパイするには `fn` を使用します: https://storybook.js.org/docs/essentials/actions#action-args
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * レンダー関数はコンポーネントのレンダリング方法を制御するためのフレームワーク固有の機能です。
 * レンダー関数の使用方法については https://storybook.js.org/docs/api/csf を参照してください。
 */
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
