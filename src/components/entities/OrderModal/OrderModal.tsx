import { notify } from '@/common/notifications';
import {
  createOrder,
  createOwner,
  createPet,
  findOwners,
  findPets,
  setNewOrder,
  updateOrder,
} from '@/features/orders.slice';
import {
  getDoctors,
  getReferrers,
  getServices,
} from '@/features/dictionary.slice';
import {
  ESex,
  IOrder,
  IOrderInput,
  IOwnerInput,
  IPetInput,
} from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, Modal, Select, Switch, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { Dayjs } from 'dayjs';
import { Key, useEffect, useMemo, useState } from 'react';
import styles from './OrderModal.module.scss';

interface IOrderModalProps {
  open: boolean;
  order: IOrder | null;
  onClose: () => void;
}

interface IOrderFields {
  clientId: string;
  referrerId?: string;
  doctorId?: string;
}

interface IOwnerFields extends Omit<IOwnerInput, 'bornDate'> {
  bornDate?: Dayjs | null;
}

interface IPetFields extends Omit<IPetInput, 'bornDate' | 'ownerId' | 'owner'> {
  bornDate?: Dayjs | null;
}

const ownerLabel = (owner: { lastName: string; firstName: string; middleName?: string | null }): string =>
  [owner.lastName, owner.firstName, owner.middleName].filter(Boolean).join(' ');

export const OrderModal = ({ open, order, onClose }: IOrderModalProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { foundOwners, foundPets, isLoading } = useAppSelector((store) => store.orders);
  const { clients, doctors, referrers, services, species, breeds } = useAppSelector(
    (store) => store.dictionaries,
  );
  const [orderForm] = Form.useForm<IOrderFields>();
  const [ownerForm] = Form.useForm<IOwnerFields>();
  const [petForm] = Form.useForm<IPetFields>();
  const selectedSpeciesId = Form.useWatch('speciesId', petForm);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [petSearch, setPetSearch] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>();
  const [selectedPetId, setSelectedPetId] = useState<string>();
  const [checkedServiceIds, setCheckedServiceIds] = useState<string[]>([]);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [createdOwner, setCreatedOwner] = useState<{ value: string; label: string }>();

  const serviceIdSet = useMemo(() => new Set(services.map((service) => service._id)), [services]);
  const serviceTree = useMemo<DataNode[]>(() => {
    const groups = new Map<string, DataNode>();
    services.forEach((service) => {
      const groupKey = `group-${service.groupId}`;
      const group = groups.get(groupKey) ?? {
        key: groupKey,
        title: service.groupName,
        children: [],
      };
      group.children?.push({
        key: service._id,
        title: `${service.code} — ${service.name} (${service.price.toLocaleString('ru-RU')} ₽)`,
      });
      groups.set(groupKey, group);
    });
    return Array.from(groups.values());
  }, [services]);

  const ownerOptions = useMemo(() => {
    const options = foundOwners.map((owner) => ({ value: owner._id, label: ownerLabel(owner) }));
    if (createdOwner && !options.some((option) => option.value === createdOwner.value)) options.push(createdOwner);
    if (order?.owner?._id && !options.some((option) => option.value === order.owner._id)) {
      options.push({ value: order.owner._id, label: ownerLabel(order.owner) });
    }
    return options;
  }, [createdOwner, foundOwners, order]);

  const petOptions = useMemo(() => {
    const options = foundPets.map((pet) => ({ value: pet._id, label: pet.nickname }));
    if (order?.pet?._id && !options.some((option) => option.value === order.pet._id)) {
      options.push({ value: order.pet._id, label: order.pet.nickname });
    }
    return options;
  }, [foundPets, order]);

  const breedOptions = useMemo(() => {
    return breeds
      .filter((breed) => !selectedSpeciesId || breed.speciesId === selectedSpeciesId)
      .map((breed) => ({ value: breed._id, label: breed.name }));
  }, [breeds, selectedSpeciesId]);

  useEffect(() => {
    if (!open) return;
    if (!doctors.length) dispatch(getDoctors());
    if (!referrers.length) dispatch(getReferrers());
    if (!services.length) dispatch(getServices());

    const clientId = order?.clientId ?? clients.find((client) => client.name === order?.clientName)?._id;
    const doctorId = order?.doctorId ?? doctors.find((doctor) => doctor.name === order?.doctor)?._id;
    orderForm.setFieldsValue({ clientId, doctorId, referrerId: order?.referrerId });
    setSelectedOwnerId(order?.owner?._id);
    setSelectedPetId(order?.pet?._id);
    setCheckedServiceIds(order?.services?.map((service) => service._id) ?? []);
  }, [clients, dispatch, doctors, order, orderForm, open, referrers.length, services.length]);

  const handleClose = (): void => {
    orderForm.resetFields();
    ownerForm.resetFields();
    petForm.resetFields();
    setOwnerSearch('');
    setPetSearch('');
    setSelectedOwnerId(undefined);
    setSelectedPetId(undefined);
    setCheckedServiceIds([]);
    setShowOwnerForm(false);
    setShowPetForm(false);
    setCreatedOwner(undefined);
    onClose();
  };

  const handleOwnerSearch = (): void => {
    const lastName = ownerSearch.trim();
    if (!lastName) return notify('warning', 'Введите фамилию владельца');
    dispatch(findOwners({ lastName }));
  };

  const handlePetSearch = (): void => {
    const nickname = petSearch.trim();
    if (!nickname && !selectedOwnerId) return notify('warning', 'Введите кличку или выберите владельца');
    dispatch(findPets(nickname ? { nickname, ownerId: selectedOwnerId } : { ownerId: selectedOwnerId! }));
  };

  const handleOwnerCreate = async (): Promise<void> => {
    try {
      const values = await ownerForm.validateFields();
      const payload: IOwnerInput = {
        lastName: values.lastName?.trim() ?? '',
        firstName: values.firstName?.trim() ?? '',
        middleName: values.middleName?.trim() ?? '',
        phone: values.phone?.trim() ?? '',
        email: values.email?.trim() ?? '',
        bornDate: values.bornDate?.toISOString() ?? '',
        snils: values.snils?.trim() ?? '',
      };
      const created = await dispatch(createOwner(payload)).unwrap();
      const id = created._id ?? created.id;
      setCreatedOwner({ value: id, label: ownerLabel(created) });
      setSelectedOwnerId(id);
      setShowOwnerForm(false);
    } catch {
      // Rejected order thunks are reported by the listener middleware.
    }
  };

  const handlePetCreate = async (): Promise<void> => {
    if (!selectedOwnerId) return notify('warning', 'Сначала выберите или создайте владельца');
    try {
      const values = await petForm.validateFields();
      const payload: IPetInput = {
        nickname: values.nickname?.trim() ?? '',
        speciesId: values.speciesId ?? '',
        breedId: values.breedId ?? '',
        sex: values.sex,
        isSterilized: values.isSterilized ?? false,
        ownerId: selectedOwnerId,
        bornDate: values.bornDate?.toISOString() ?? '',
        age: values.age?.trim() ?? '',
      };
      const created = await dispatch(createPet(payload)).unwrap();
      setSelectedPetId(created._id);
      setShowPetForm(false);
    } catch {
      // Rejected order thunks are reported by the listener middleware.
    }
  };

  const handleServicesCheck = (keys: Key[] | { checked: Key[]; halfChecked: Key[] }): void => {
    const checked = Array.isArray(keys) ? keys : keys.checked;
    setCheckedServiceIds(checked.map(String).filter((key) => serviceIdSet.has(key)));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedPetId) return notify('warning', 'Выберите или создайте питомца');
    if (!checkedServiceIds.length) return notify('warning', 'Выберите хотя бы одну услугу');
    try {
      const values = await orderForm.validateFields();
      const payload: IOrderInput = { ...values, petId: selectedPetId, services: checkedServiceIds };
      dispatch(setNewOrder(payload));
      if (order) await dispatch(updateOrder({ id: order._id, payload })).unwrap();
      else await dispatch(createOrder(payload)).unwrap();
      handleClose();
    } catch {
      // Rejected order thunks are reported by the listener middleware.
    }
  };

  return (
    <Modal
      open={open}
      width={1100}
      title={order ? 'Редактирование заказа' : 'Новый заказ'}
      okText={order ? 'Сохранить' : 'Создать заказ'}
      cancelText="Отмена"
      confirmLoading={isLoading}
      onOk={handleSubmit}
      onCancel={handleClose}
      destroyOnClose
    >
      <div className={styles.modalBody}>
        <section className={styles.section}>
          <h3>Владелец и питомец</h3>
          <Flex gap={8} align="flex-end" wrap="wrap">
            <Flex vertical className={styles.searchField}>
              <span>Поиск владельца по фамилии</span>
              <Input value={ownerSearch} onChange={(event) => setOwnerSearch(event.currentTarget.value)} />
            </Flex>
            <Button icon={<SearchOutlined />} onClick={handleOwnerSearch}>Найти</Button>
            <Button icon={<PlusOutlined />} onClick={() => setShowOwnerForm((value) => !value)}>Новый владелец</Button>
            <Select
              className={styles.entitySelect}
              value={selectedOwnerId}
              options={ownerOptions}
              placeholder="Выберите владельца"
              onChange={(value) => {
                setSelectedOwnerId(value);
                setSelectedPetId(undefined);
              }}
              showSearch
              optionFilterProp="label"
            />
          </Flex>
          {showOwnerForm && (
            <Form form={ownerForm} layout="vertical" className={styles.inlineForm}>
              <Form.Item name="lastName" label="Фамилия" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="firstName" label="Имя" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="middleName" label="Отчество"><Input /></Form.Item>
              <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="email" label="Email"><Input /></Form.Item>
              <Form.Item name="bornDate" label="Дата рождения"><DatePicker /></Form.Item>
              <Form.Item name="snils" label="СНИЛС"><Input /></Form.Item>
              <Button type="primary" onClick={handleOwnerCreate}>Создать владельца</Button>
            </Form>
          )}
          <Flex gap={8} align="flex-end" wrap="wrap">
            <Flex vertical className={styles.searchField}>
              <span>Поиск питомца по кличке</span>
              <Input value={petSearch} onChange={(event) => setPetSearch(event.currentTarget.value)} />
            </Flex>
            <Button icon={<SearchOutlined />} onClick={handlePetSearch}>Найти</Button>
            <Button icon={<PlusOutlined />} onClick={() => setShowPetForm((value) => !value)}>Новый питомец</Button>
            <Select
              className={styles.entitySelect}
              value={selectedPetId}
              options={petOptions}
              placeholder="Выберите питомца"
              onChange={setSelectedPetId}
              showSearch
              optionFilterProp="label"
            />
          </Flex>
          {showPetForm && (
            <Form form={petForm} layout="vertical" className={styles.inlineForm} initialValues={{ sex: ESex.MALE, isSterilized: false }}>
              <Form.Item name="nickname" label="Кличка" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="speciesId" label="Вид" rules={[{ required: true }]}>
                <Select options={species.map((item) => ({ value: item._id, label: item.name }))} onChange={() => petForm.setFieldValue('breedId', undefined)} />
              </Form.Item>
              <Form.Item name="breedId" label="Порода" rules={[{ required: true }]}><Select options={breedOptions} /></Form.Item>
              <Form.Item name="sex" label="Пол" rules={[{ required: true }]}><Select options={[{ value: ESex.MALE, label: 'Самец' }, { value: ESex.FEMALE, label: 'Самка' }]} /></Form.Item>
              <Form.Item name="bornDate" label="Дата рождения"><DatePicker /></Form.Item>
              <Form.Item name="age" label="Возраст"><Input /></Form.Item>
              <Form.Item name="isSterilized" label="Стерилизован" valuePropName="checked"><Switch /></Form.Item>
              <Button type="primary" onClick={handlePetCreate}>Создать питомца</Button>
            </Form>
          )}
        </section>

        <section className={`${styles.section} ${styles.servicesSection}`}>
          <h3>Услуги</h3>
          <Tree checkable checkedKeys={checkedServiceIds} treeData={serviceTree} onCheck={handleServicesCheck} />
        </section>

        <section className={styles.section}>
          <h3>Данные заказа</h3>
          <Form form={orderForm} layout="vertical">
            <Form.Item name="clientId" label="Контрагент" rules={[{ required: true, message: 'Выберите контрагента' }]}>
              <Select showSearch optionFilterProp="label" options={clients.map((item) => ({ value: item._id, label: item.name }))} />
            </Form.Item>
            <Form.Item name="referrerId" label="Направитель">
              <Select allowClear showSearch optionFilterProp="label" options={referrers.map((item) => ({ value: item._id, label: item.name }))} />
            </Form.Item>
            <Form.Item name="doctorId" label="Врач">
              <Select allowClear showSearch optionFilterProp="label" options={doctors.map((item) => ({ value: item._id, label: item.name }))} />
            </Form.Item>
          </Form>
        </section>
      </div>
    </Modal>
  );
};
