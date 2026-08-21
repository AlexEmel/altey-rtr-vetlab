import { notify } from '@/common/notifications';
import { AppButton } from '@/components/ui/buttons/AppButton/AppButton';
import { login } from '@/features/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Flex, Input } from 'antd';
import Password from 'antd/es/input/Password';
import Title from 'antd/es/typography/Title';
import { useCallback, useState } from 'react';
import styles from './LoginForm.module.scss';

export const LoginForm = (): JSX.Element => {
  const isLoading = useAppSelector((store) => store.user.isLoading);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(() => {
    if (isLoading) return;

    const userTrimmed = username.trim();
    const passTrimmed = password.trim();

    if (!userTrimmed) {
      notify('warning', 'Введите имя пользователя');
      return;
    }

    if (!passTrimmed) {
      notify('warning', 'Введите пароль');
      return;
    }

    dispatch(login({ username: userTrimmed, password: passTrimmed }));
  }, [dispatch, isLoading, username, password]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleLogin();
    },
    [handleLogin],
  );

  return (
    <Flex vertical className={styles.loginForm}>
      <Title level={4} className={styles.formTitle}>
        Вход в систему
      </Title>
      <Flex className={styles.inputContainer}>
        <Flex className={styles.inputBox}>
          <label className={styles.inputLabel}>Имя пользователя</label>
          <Input
            prefix={<UserOutlined />}
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            autoFocus
            className={styles.formInput}
          />
        </Flex>
        <Flex className={styles.inputBox}>
          <label className={styles.inputLabel}>Пароль</label>
          <Password
            prefix={<LockOutlined />}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            className={styles.formInput}
          />
        </Flex>
        <Flex className={styles.buttonBox}>
          <AppButton text="ВОЙТИ" disabled={isLoading} onClick={handleLogin} />
        </Flex>
      </Flex>
    </Flex>
  );
};
