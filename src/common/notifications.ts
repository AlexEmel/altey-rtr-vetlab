import { notification } from 'antd';

export type TNotifyType = 'success' | 'error' | 'warning';

notification.config({
  getContainer: () => document.getElementById('root') ?? document.body,
  placement: 'bottomRight',
  duration: 2,
});

export const notify = (type: TNotifyType, message: string) => {
  notification[type]({ message });
};
