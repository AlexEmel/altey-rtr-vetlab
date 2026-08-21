import { EResultViewRule, EResultViewType, setResultViewRules } from '@/features/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Checkbox, Flex, Radio } from 'antd';
import styles from './ResultViewRules.module.scss';
import Title from 'antd/es/typography/Title';

export const ResultViewRules = (): JSX.Element => {
  const viewRule = useAppSelector((store) => store.user.resultViewRules.view);
  const typeRule = useAppSelector((store) => store.user.resultViewRules.type);
  const attachmentRule = useAppSelector((store) => store.user.resultViewRules.attachments);
  const dispatch = useAppDispatch();

  return (
    <Flex className={styles.container}>
      <Flex vertical>
        <Title level={5}>Условия просмотра результатов:</Title>
        <Radio.Group
          onChange={(e) => dispatch(setResultViewRules({ view: e.target.value }))}
          value={viewRule}
          className={styles.radioGroup}
        >
          <Radio value={EResultViewRule.ORDER_DONE}>Заказ выполнен полностью</Radio>
          <Radio value={EResultViewRule.NAPR_DONE}>Направление выполнено полностью</Radio>
          <Radio value={EResultViewRule.NAPR_SIGNED}>Направление авторизовано</Radio>
          <Radio value={EResultViewRule.PRELIMINARY_RESULT}>
            Направление авторизовано или есть предварительные результаты
          </Radio>
        </Radio.Group>
      </Flex>
      <Flex vertical>
        <Title level={5}>Тип бланка результатов:</Title>
        <Radio.Group
          onChange={(e) => dispatch(setResultViewRules({ type: e.target.value }))}
          value={typeRule}
          className={styles.radioGroup}
        >
          <Radio value={EResultViewType.REGULAR}>Стандартный бланк</Radio>
          <Radio value={EResultViewType.MERGED}>Общий бланк</Radio>
          <Radio value={EResultViewType.ENG}>Англоязычный бланк</Radio>
        </Radio.Group>
      </Flex>
      <Checkbox
        checked={attachmentRule}
        onChange={(e) => dispatch(setResultViewRules({ attachments: e.target.checked }))}
      >
        Вывод бланка с вложениями в результатах
      </Checkbox>
    </Flex>
  );
};
