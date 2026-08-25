import { LoginForm } from '@/components/forms/LoginForm/LoginForm';
import { SetPasswordForm } from '@/components/forms/SetPasswordForm/SetPasswordForm';
import { AppLogo } from '@/components/ui/Logo/Logo';
import { useAppSelector } from '@/store/store';
import { Flex } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import Title from 'antd/es/typography/Title';

export const LoginPage = (): JSX.Element => {
  const isTempPassword = useAppSelector((store) => store.user.isTempPassword);
  const isLoggedIn = useAppSelector((store) => store.user.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/archive', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <Flex vertical className={styles.container}>
      <Title level={2}>УДАЛЕННЫЙ ПРОЦЕДУРНЫЙ КАБИНЕТ</Title>
      <Flex gap={20}>{isTempPassword ? <SetPasswordForm /> : <LoginForm />}</Flex>
      <Flex className={styles.logo}>
        <AppLogo />
      </Flex>
    </Flex>
  );
};
