import { ConfigProvider } from 'antd';
import locale from 'antd/locale/ru_RU';

export default function AppConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        components: {
          Form: {
            verticalLabelPadding: 0,
          },
          Button: {
            colorPrimaryBg: 'var(--color-primary)',
            defaultHoverColor: 'var(--color-accent)',
            defaultHoverBorderColor: 'var(--color-primary)',
            defaultActiveColor: 'var(--color-accent)',
            defaultActiveBorderColor: 'var(--color-primary)',
          },
          Input: {
            hoverBorderColor: 'var(--color-accent)',
            activeBorderColor: 'var(--color-accent)',
          },
          Select: {
            hoverBorderColor: 'var(--color-accent)',
            activeBorderColor: 'var(--color-accent)',
          },
          DatePicker: {
            hoverBorderColor: 'var(--color-accent)',
            activeBorderColor: 'var(--color-accent)',
          },
          Table: {
            rowSelectedBg: 'var(--color-bg-selected-row)',
            rowSelectedHoverBg: 'var(--color-bg-selected-row-hover)',
            cellPaddingBlockMD: 1,
            cellPaddingInlineMD: 8,
          },
          Tabs: {
            itemHoverColor: 'var(--color-primary)',
            itemSelectedColor: 'var(--color-primary)',
            itemActiveColor: 'var(--color-primary)',
            inkBarColor: 'var(--color-accent)'
          }
        },
        token: {
          colorText: 'var(--color-text)'
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}
