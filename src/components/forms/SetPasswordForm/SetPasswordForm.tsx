import { AppButton } from '@/components/ui/buttons/AppButton/AppButton';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { LockOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import Password from 'antd/es/input/Password';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';
import styles from './SetPasswordForm.module.scss';
import { setPassword } from '@/features/user.slice';
import { notify } from '@/common/notifications';

export const SetPasswordForm = (): JSX.Element => {
  const isLoading = useAppSelector((store) => store.user.isLoading);
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const dispatch = useAppDispatch();

  function validatePassword(): boolean {
    const password = newPass.trim();
    const confirm = confirmPass.trim();
    if (!newPass) {
      notify('warning', 'Пароль не может быть пустым');
      return false;
    } else if (password.length < 6 || password.length > 20) {
      notify('warning', 'Пароль не может быть короче 6 и длиннее 20 символов');
      return false;
    } else if (password !== confirm) {
      notify('warning', 'Пароли не совпадают');
      return false;
    }

    return true;
  }

  const handleSetPassword = (): void => {
    if (validatePassword() && !isLoading) {
      dispatch(setPassword(newPass));
    } else {
      return;
    }
  };

  return (
    <Flex vertical className={styles.setPassForm}>
      <Flex vertical className={styles.formInfo}>
        <Title level={4} className={styles.formTitle}>
          Изменение пароля
        </Title>
        <p className={styles.formDescription}>
          Вы произвели вход по временному паролю. В целях безопасности Вашей учётной записи, необходимо задать
          новый пароль
        </p>
      </Flex>
      <Flex vertical gap={20} className={styles.inputContainer}>
        <Flex className={styles.inputBox}>
          <label className={styles.inputLabel}>Пароль</label>
          <Password
            prefix={<LockOutlined />}
            placeholder="Введите пароль"
            value={newPass}
            onChange={(e) => setNewPass(e.currentTarget.value)}
            className={styles.formInput}
          />
        </Flex>
        <Flex className={styles.inputBox}>
          <label className={styles.inputLabel}>Подтверждение пароля</label>
          <Password
            prefix={<LockOutlined />}
            placeholder="Повторите пароль"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.currentTarget.value)}
            className={styles.formInput}
          />
        </Flex>
        <Flex className={styles.buttonBox}>
          <AppButton text="ИЗМЕНИТЬ" disabled={isLoading} onClick={handleSetPassword} />
        </Flex>
      </Flex>
    </Flex>
  );
};
