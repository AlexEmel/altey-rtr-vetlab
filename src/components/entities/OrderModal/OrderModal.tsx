import { notify } from '@/common/notifications';
import {
  createOrder,
  createOwner,
  createPet,
  findOwners,
  findPets,
  resetFoundOwners,
  resetFoundPets,
  setNewOrder,
  updateOrder,
  updateOwner,
  updatePet,
} from '@/features/orders.slice';
import { getDoctors, getReferrers, getServices } from '@/features/dictionary.slice';
import {
  EOrderStatus,
  ESex,
  IOrder,
  IOrderInput,
  IOwnerInput,
  IOwnerRecord,
  IPetInput,
} from '@/interfaces/entities/order.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { maskRussianPhone, normalizeRussianPhone } from '@/utils/common.util';
import palmIcon from '@/assets/icons/palm.png';
import pawIcon from '@/assets/icons/paw.png';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Radio, Select, Space, Switch, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import dayjs, { Dayjs } from 'dayjs';
import { Key, ReactNode, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
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

interface IOwnerFields extends Omit<IOwnerInput, 'bornDate' | 'phone'> {
  bornDate?: Dayjs | null;
  phone: string;
}

interface IPetFields extends Omit<IPetInput, 'bornDate' | 'ownerId' | 'owner'> {
  bornDate?: Dayjs | null;
}

type TOwnerSearchMode = 'lastName' | 'phone';

interface IOwnerOption {
  value: string;
  label: ReactNode;
  plainLabel: string;
}

interface IPetOption {
  value: string;
  label: ReactNode;
  plainLabel: string;
}

const ownerLabel = (owner: { lastName: string; firstName: string; middleName?: string | null }): string =>
  [owner.lastName, owner.firstName, owner.middleName].filter(Boolean).join(' ');

const getOwnerMeta = (owner: Pick<IOwnerRecord, 'bornDate' | 'phone'>): string => {
  const parts: string[] = [];

  if (owner.bornDate) parts.push(dayjs(owner.bornDate).format('DD.MM.YYYY'));
  if (owner.phone) parts.push(maskRussianPhone(owner.phone));

  return parts.join(' • ');
};

const createOwnerOption = (owner: IOwnerRecord): IOwnerOption => {
  const meta = getOwnerMeta(owner);

  return {
    value: owner._id,
    plainLabel: ownerLabel(owner),
    label: (
      <div className={styles.ownerOption}>
        <span className={styles.ownerOptionName}>{ownerLabel(owner)}</span>
        {meta && <span className={styles.ownerOptionMeta}>{meta}</span>}
      </div>
    ),
  };
};

const petSexLabel: Record<ESex, string> = {
  [ESex.MALE]: 'Самец',
  [ESex.FEMALE]: 'Самка',
};

const orderOwnerToRecord = (orderOwner: IOrder['owner']): IOwnerRecord => ({
  _id: orderOwner._id,
  lastName: orderOwner.lastName,
  firstName: orderOwner.firstName,
  middleName: orderOwner.middleName,
  bornDate: orderOwner.bornDate ?? '',
  email: orderOwner.email ?? '',
  phone: orderOwner.phone ?? '',
  snils: orderOwner.snils ?? '',
});

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
  const [ownerSearchMode, setOwnerSearchMode] = useState<TOwnerSearchMode>('lastName');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [petSearch, setPetSearch] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>();
  const [selectedPetId, setSelectedPetId] = useState<string>();
  const [checkedServiceIds, setCheckedServiceIds] = useState<string[]>([]);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [createdOwner, setCreatedOwner] = useState<IOwnerRecord>();
  const [debouncedOwnerSearch] = useDebounce(ownerSearch.trim(), 400);

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
        title: `${service.code} - ${service.name} (${service.price.toLocaleString('ru-RU')} ₽)`,
      });
      groups.set(groupKey, group);
    });

    return Array.from(groups.values());
  }, [services]);

  const ownerOptions = useMemo<IOwnerOption[]>(() => {
    const options = foundOwners.map(createOwnerOption);

    if (createdOwner && !options.some((option) => option.value === createdOwner._id)) {
      options.push(createOwnerOption(createdOwner));
    }

    if (order?.owner?._id && !options.some((option) => option.value === order.owner._id)) {
      options.push(createOwnerOption(orderOwnerToRecord(order.owner)));
    }

    return options;
  }, [createdOwner, foundOwners, order]);

  const petOptions = useMemo<IPetOption[]>(() => {
    const createPetOption = (pet: IOrder['pet']): IPetOption => {
      const breed = pet.breedId ? breeds.find((item) => item._id === pet.breedId)?.name : undefined;
      const speciesName = species.find((item) => item._id === pet.speciesId)?.name;
      const speciesOrBreed = breed ?? speciesName;
      const meta = [speciesOrBreed, petSexLabel[pet.sex], pet.age].filter(Boolean).join(' • ');

      return {
        value: pet._id,
        plainLabel: pet.nickname,
        label: (
          <div className={styles.petOption}>
            <span className={styles.petOptionName}>{pet.nickname}</span>
            {meta && <span className={styles.petOptionMeta}>{meta}</span>}
          </div>
        ),
      };
    };

    const normalizedSearch = petSearch.trim().toLocaleLowerCase();
    const options = foundPets
      .filter((pet) => pet.nickname.toLocaleLowerCase().includes(normalizedSearch))
      .map(createPetOption);

    if (order?.pet?._id && !options.some((option) => option.value === order.pet._id)) {
      options.push(createPetOption(order.pet));
    }

    return options;
  }, [breeds, foundPets, order, petSearch, species]);

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

  useEffect(() => {
    if (!open || ownerSearchMode !== 'lastName') return;

    if (!debouncedOwnerSearch) {
      dispatch(resetFoundOwners());
      return;
    }

    if (debouncedOwnerSearch.length < 2) {
      dispatch(resetFoundOwners());
      return;
    }

    dispatch(findOwners({ lastName: debouncedOwnerSearch }));
  }, [debouncedOwnerSearch, dispatch, open, ownerSearchMode]);

  useEffect(() => {
    if (!open || ownerSearchMode !== 'phone') return;

    const normalizedPhone = normalizeRussianPhone(ownerSearch);

    if (!normalizedPhone) {
      dispatch(resetFoundOwners());
      return;
    }

    if (/^\+7\d{10}$/.test(normalizedPhone)) {
      dispatch(findOwners({ phone: normalizedPhone }));
      return;
    }

    dispatch(resetFoundOwners());
  }, [dispatch, open, ownerSearch, ownerSearchMode]);

  useEffect(() => {
    if (!open || !selectedOwnerId) {
      dispatch(resetFoundPets());
      return;
    }

    dispatch(findPets({ ownerId: selectedOwnerId }));
  }, [dispatch, open, selectedOwnerId]);

  const handleClose = (): void => {
    orderForm.resetFields();
    ownerForm.resetFields();
    petForm.resetFields();
    setOwnerSearch('');
    setOwnerSearchMode('lastName');
    setPetSearch('');
    setSelectedOwnerId(undefined);
    setSelectedPetId(undefined);
    setCheckedServiceIds([]);
    setShowOwnerForm(false);
    setShowPetForm(false);
    setIsEditingOwner(false);
    setIsEditingPet(false);
    setCreatedOwner(undefined);
    dispatch(resetFoundOwners());
    dispatch(resetFoundPets());
    onClose();
  };

  const getSelectedOwner = (): IOwnerRecord | undefined => {
    if (!selectedOwnerId) return undefined;
    return (
      foundOwners.find((owner) => owner._id === selectedOwnerId) ??
      (createdOwner?._id === selectedOwnerId ? createdOwner : undefined) ??
      (order?.owner._id === selectedOwnerId ? orderOwnerToRecord(order.owner) : undefined)
    );
  };

  const getSelectedPet = (): IOrder['pet'] | undefined => {
    if (!selectedPetId) return undefined;
    return (
      foundPets.find((pet) => pet._id === selectedPetId) ??
      (order?.pet._id === selectedPetId ? order.pet : undefined)
    );
  };

  const handleOwnerCreateOpen = (): void => {
    if (showOwnerForm && !isEditingOwner) {
      setShowOwnerForm(false);
      return;
    }

    ownerForm.resetFields();
    setIsEditingOwner(false);
    setShowOwnerForm(true);
  };

  const handleOwnerEditOpen = (): void => {
    const owner = getSelectedOwner();
    if (!owner) return notify('warning', 'Выберите владельца для редактирования');

    ownerForm.setFieldsValue({
      lastName: owner.lastName,
      firstName: owner.firstName,
      middleName: owner.middleName,
      phone: maskRussianPhone(owner.phone),
      email: owner.email,
      bornDate: owner.bornDate ? dayjs(owner.bornDate) : null,
      snils: owner.snils,
    });
    setIsEditingOwner(true);
    setShowOwnerForm(true);
  };

  const handleOwnerCreate = async (): Promise<void> => {
    try {
      const values = await ownerForm.validateFields();
      const payload: IOwnerInput = {
        lastName: values.lastName?.trim() ?? '',
        firstName: values.firstName?.trim() ?? '',
        middleName: values.middleName?.trim() ?? '',
        phone: normalizeRussianPhone(values.phone),
        email: values.email?.trim() ?? '',
        bornDate: values.bornDate?.toISOString() ?? '',
        snils: values.snils?.trim() ?? '',
      };
      if (isEditingOwner && selectedOwnerId) {
        const updated = await dispatch(updateOwner({ id: selectedOwnerId, payload })).unwrap();
        setCreatedOwner(updated);
        setShowOwnerForm(false);
        setIsEditingOwner(false);
        return;
      }

      const created = await dispatch(createOwner(payload)).unwrap();
      const id = created._id ?? created.id;
      const createdRecord: IOwnerRecord = { ...created, _id: id };

      setCreatedOwner(createdRecord);
      setSelectedOwnerId(id);
      setOwnerSearch('');
      setOwnerSearchMode('lastName');
      setShowOwnerForm(false);
    } catch {
      // Rejected order thunks are reported by the listener middleware.
    }
  };

  const handlePetCreateOpen = (): void => {
    if (showPetForm && !isEditingPet) {
      setShowPetForm(false);
      return;
    }

    petForm.resetFields();
    petForm.setFieldsValue({ sex: ESex.MALE, isSterilized: false });
    setIsEditingPet(false);
    setShowPetForm(true);
  };

  const handlePetEditOpen = (): void => {
    const pet = getSelectedPet();
    if (!pet) return notify('warning', 'Выберите питомца для редактирования');

    petForm.setFieldsValue({
      nickname: pet.nickname,
      speciesId: pet.speciesId,
      breedId: pet.breedId ?? '',
      sex: pet.sex,
      bornDate: pet.bornDate ? dayjs(pet.bornDate) : null,
      age: pet.age,
      isSterilized: pet.isSterilized,
    });
    setIsEditingPet(true);
    setShowPetForm(true);
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
      if (isEditingPet && selectedPetId) {
        await dispatch(updatePet({ id: selectedPetId, payload })).unwrap();
        setShowPetForm(false);
        setIsEditingPet(false);
        return;
      }

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

  const handleOwnerSearchInput = (value: string): void => {
    setOwnerSearch(ownerSearchMode === 'phone' ? maskRussianPhone(value) : value);
  };

  const ownerSearchPlaceholder =
    ownerSearchMode === 'lastName' ? 'Поиск владельца по фамилии' : '+7 (999) 999-99-99';

  const ownerNotFoundContent =
    ownerSearchMode === 'lastName'
      ? ownerSearch.trim().length < 2
        ? 'Введите минимум 2 символа'
        : 'Ничего не найдено'
      : normalizeRussianPhone(ownerSearch).length < 12
        ? 'Введите номер полностью'
        : 'Ничего не найдено';

  const petNotFoundContent = selectedOwnerId ? 'Ничего не найдено' : 'Сначала выберите владельца';

  return (
    <Modal
      open={open}
      width={1100}
      title={order ? 'Редактирование заказа' : 'Новый заказ'}
      okText={order ? 'Сохранить' : 'Создать заказ'}
      okButtonProps={{ disabled: !!order && order.status === EOrderStatus.ACCEPTED }}
      cancelText="Отмена"
      confirmLoading={isLoading}
      onOk={handleSubmit}
      onCancel={handleClose}
      destroyOnClose
    >
      <div className={styles.modalBody}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><img src={palmIcon} alt="" aria-hidden="true" />Владелец</h3>
            <Space>
              <Button icon={<PlusOutlined />} onClick={handleOwnerCreateOpen}>
                Новый владелец
              </Button>
              <Button icon={<EditOutlined />} disabled={!selectedOwnerId} onClick={handleOwnerEditOpen}>
                Редактировать
              </Button>
            </Space>
          </div>
          <Space.Compact className={styles.ownerSearchControls} block>
              <Radio.Group
                value={ownerSearchMode}
                onChange={(event) => {
                  setOwnerSearchMode(event.target.value);
                  setOwnerSearch('');
                  dispatch(resetFoundOwners());
                }}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="lastName">По фамилии</Radio.Button>
                <Radio.Button value="phone">По телефону</Radio.Button>
              </Radio.Group>
              <Select
                className={styles.ownerSearchSelect}
                value={selectedOwnerId}
                options={ownerOptions}
                placeholder={ownerSearchPlaceholder}
                onChange={(value) => {
                  setSelectedOwnerId(value);
                  setSelectedPetId(undefined);
                  setPetSearch('');
                  setShowOwnerForm(false);
                  setShowPetForm(false);
                  setIsEditingOwner(false);
                  setIsEditingPet(false);
                  ownerForm.resetFields();
                  petForm.resetFields();
                }}
                onSearch={handleOwnerSearchInput}
                searchValue={ownerSearch}
                showSearch
                filterOption={false}
                optionLabelProp="plainLabel"
                notFoundContent={ownerNotFoundContent}
                allowClear
              />
          </Space.Compact>
          {showOwnerForm && (
            <Form form={ownerForm} layout="vertical" className={styles.inlineForm}>
              <Form.Item name="lastName" label="Фамилия" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="firstName" label="Имя" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="middleName" label="Отчество">
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[
                  { required: true },
                  { pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, message: 'Используйте формат +7 (999) 999-99-99' },
                ]}
                getValueFromEvent={(event) => maskRussianPhone(event.currentTarget.value)}
              >
                <Input placeholder="+7 (999) 999-99-99" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="bornDate" label="Дата рождения">
                <DatePicker />
              </Form.Item>
              <Form.Item name="snils" label="СНИЛС">
                <Input />
              </Form.Item>
              <Button type="primary" onClick={handleOwnerCreate}>
                {isEditingOwner ? 'Сохранить владельца' : 'Создать владельца'}
              </Button>
            </Form>
          )}
          <div className={styles.petSection}>
            <div className={styles.sectionHeader}>
              <h3><img src={pawIcon} alt="" aria-hidden="true" />Питомец</h3>
              <Space>
                <Button icon={<PlusOutlined />} onClick={handlePetCreateOpen} disabled={!selectedOwnerId}>
                  Новый питомец
                </Button>
                <Button icon={<EditOutlined />} disabled={!selectedPetId} onClick={handlePetEditOpen}>
                  Редактировать
                </Button>
              </Space>
            </div>
            <Select
              className={styles.petSearchSelect}
              value={selectedPetId}
              options={petOptions}
              placeholder="Поиск питомца по кличке"
              onChange={(value) => {
                setSelectedPetId(value);
                setShowPetForm(false);
                setIsEditingPet(false);
                petForm.resetFields();
              }}
              onSearch={setPetSearch}
              searchValue={petSearch}
              showSearch
              filterOption={false}
              optionLabelProp="plainLabel"
              notFoundContent={petNotFoundContent}
              disabled={!selectedOwnerId}
              allowClear
            />
          </div>
          {showPetForm && (
            <Form
              form={petForm}
              layout="vertical"
              className={styles.inlineForm}
              initialValues={{ sex: ESex.MALE, isSterilized: false }}
            >
              <Form.Item name="nickname" label="Кличка" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="speciesId" label="Вид" rules={[{ required: true }]}>
                <Select
                  options={species.map((item) => ({ value: item._id, label: item.name }))}
                  onChange={() => petForm.setFieldValue('breedId', undefined)}
                />
              </Form.Item>
              <Form.Item name="breedId" label="Порода" rules={[{ required: true }]}>
                <Select options={breedOptions} />
              </Form.Item>
              <Form.Item name="sex" label="Пол" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: ESex.MALE, label: 'Самец' },
                    { value: ESex.FEMALE, label: 'Самка' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="bornDate" label="Дата рождения">
                <DatePicker />
              </Form.Item>
              <Form.Item name="age" label="Возраст">
                <Input />
              </Form.Item>
              <Form.Item name="isSterilized" label="Стерилизован" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Button type="primary" onClick={handlePetCreate}>
                {isEditingPet ? 'Сохранить питомца' : 'Создать питомца'}
              </Button>
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
            <Form.Item
              name="clientId"
              label="Контрагент"
              rules={[{ required: true, message: 'Выберите контрагента' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={clients.map((item) => ({ value: item._id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item name="referrerId" label="Направитель">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={referrers.map((item) => ({ value: item._id, label: item.name }))}
              />
            </Form.Item>
            <Form.Item name="doctorId" label="Врач">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={doctors.map((item) => ({ value: item._id, label: item.name }))}
              />
            </Form.Item>
          </Form>
        </section>
      </div>
    </Modal>
  );
};
