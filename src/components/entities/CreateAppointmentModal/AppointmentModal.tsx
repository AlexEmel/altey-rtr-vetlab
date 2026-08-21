import AppCalendar from '@/components/ui/AppCalendar/AppCalendar';
import {
  createAppointment,
  editAppointment,
  getTreatmentRoomsQuotas,
  resetTreatmentRoomQuotas,
  setCurrentAppointment,
  setShowAppointmentModal,
} from '@/features/appointments.slice';
import { ISelectOption } from '@/interfaces/app/util.interface';
import { EAppointmentPatientSex, INewAppointment } from '@/interfaces/entities/appointment.interface';
import { ITreatmentRoomQuota, TQuotasCalendar } from '@/interfaces/entities/treatment-room-quota.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { createQuotasCalendar } from '@/utils/quotas.util';
import { addRussianPhonePrefix } from '@/utils/common.util';
import { Empty, Form, Input, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import SlotCard from '../SlotCard/SlotCard';
import styles from './AppointmentModal.module.scss';

type TAppointmentFormValues = INewAppointment;

const DEFAULT_SERVICES = [
  {
    serviceCode: import.meta.env.VITE_SPERMOGRAM_SERVICE_CODE,
    serviceName: import.meta.env.VITE_SPERMOGRAM_SERVICE_NAME,
  },
];

export default function AppointmentModal(): ReactNode {
  const isOpen = useAppSelector((store) => store.appointments.appointmentModal.isOpen);
  const mode = useAppSelector((store) => store.appointments.appointmentModal.mode);
  const currentAppointment = useAppSelector((store) => store.appointments.currentAppointment);
  const treatmentRooms = useAppSelector((store) => store.dictionaries.treatmentRooms);
  const departments = useAppSelector((store) => store.dictionaries.departments);
  const insuranceTypes = useAppSelector((store) => store.dictionaries.insuranceTypes);
  const treatmentRoomQuotas = useAppSelector((state) => state.appointments.treatmentRoomQuotas);
  const [form] = Form.useForm<TAppointmentFormValues>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateQuotas, setSelectedDateQuotas] = useState<ITreatmentRoomQuota[]>([]);
  const troomId = Form.useWatch('troomId', form);
  const quotaId = Form.useWatch('quotaId', form);
  const dispatch = useAppDispatch();

  const treatmentRoomSelectOptions = useMemo<ISelectOption[]>(() => {
    if (!treatmentRooms?.length) return [];

    return treatmentRooms.map((troom) => ({
      value: troom._id,
      label: troom.name,
    }));
  }, [treatmentRooms]);

  const departmentSelectOptions = useMemo<ISelectOption[]>(
    () => departments.map((department) => ({ value: department._id, label: department.name })),
    [departments],
  );

  const insuranceTypeSelectOptions = useMemo<ISelectOption[]>(
    () =>
      insuranceTypes.map((insuranceType) => ({
        value: insuranceType._id,
        label: insuranceType.name,
      })),
    [insuranceTypes],
  );

  const currentAppointmentDate =
    mode === 'edit' && currentAppointment ? dayjs(currentAppointment.quota.workDay) : undefined;

  useEffect(() => {
    if (troomId) {
      dispatch(getTreatmentRoomsQuotas(troomId));
    } else {
      dispatch(resetTreatmentRoomQuotas());
    }
  }, [dispatch, troomId]);

  const quotasCalendar = useMemo<TQuotasCalendar>(() => {
    return createQuotasCalendar(treatmentRoomQuotas);
  }, [treatmentRoomQuotas]);

  useEffect(() => {
    form.setFieldValue('quotaId', undefined);

    if (selectedDate) {
      const dateQuotas = quotasCalendar
        .get(selectedDate.year())
        ?.get(selectedDate.month())
        ?.get(selectedDate.date());
      setSelectedDateQuotas(dateQuotas ?? []);
      return;
    }

    setSelectedDateQuotas([]);
  }, [form, quotasCalendar, selectedDate]);

  useEffect(() => {
    return () => {
      form.resetFields();
      setSelectedDate(null);
      setSelectedDateQuotas([]);
      dispatch(resetTreatmentRoomQuotas());
    };
  }, [dispatch, form, isOpen]);

  useEffect(() => {
    const defaultValues: Partial<TAppointmentFormValues> = {
      services: DEFAULT_SERVICES,
    };

    if (mode === 'edit' && currentAppointment) {
      form.setFieldsValue({
        ...defaultValues,
        troomId: currentAppointment.troomId,
        lastName: currentAppointment.patient.lastName,
        firstName: currentAppointment.patient.firstName,
        middleName: currentAppointment.patient.middleName,
        sex: currentAppointment.patient.sex,
        phone: currentAppointment.patient.phone,
        departmentId: currentAppointment.departmentId,
        insuranceTypeId: currentAppointment.insuranceTypeId,
        services: currentAppointment.services?.length ? currentAppointment.services : DEFAULT_SERVICES,
      });
    } else {
      form.setFieldsValue(defaultValues);
    }
  }, [currentAppointment, form, mode]);

  useEffect(() => {
    if (mode === 'edit' && currentAppointment && selectedDateQuotas.length > 0) {
      form.setFieldValue('quotaId', currentAppointment.quota.quotaId);
    }
  }, [currentAppointment, form, mode, selectedDateQuotas]);

  const handleClose = (): void => {
    dispatch(setShowAppointmentModal(false));
    dispatch(setCurrentAppointment(null));
    dispatch(resetTreatmentRoomQuotas());
  };

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    const trimmedPhone = values.phone.trim();
    const trimmedLastName = values.lastName?.trim();
    const trimmedFirstName = values.firstName?.trim();
    const trimmedMiddleName = values.middleName?.trim();

    const payload: INewAppointment = {
      troomId: values.troomId,
      quotaId: values.quotaId,
      phone: trimmedPhone,
      lastName: trimmedLastName,
      firstName: trimmedFirstName,
      middleName: trimmedMiddleName || undefined,
      departmentId: values.departmentId || undefined,
      insuranceTypeId: values.insuranceTypeId || undefined,
      sex: values.sex || EAppointmentPatientSex.MALE,
      services: values.services?.length ? values.services : DEFAULT_SERVICES,
    };

    form.setFieldsValue(payload);

    if (mode === 'edit' && currentAppointment) {
      dispatch(editAppointment({ id: currentAppointment._id, payload }));
      handleClose();
      return;
    }

    dispatch(createAppointment(payload));
    handleClose();
  };

  return (
    <Modal
      width={880}
      styles={{
        body: { padding: '10px 10px 20px' },
      }}
      open={isOpen}
      title={mode === 'edit' ? 'Редактирование записи' : 'Новая запись'}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText={mode === 'edit' ? 'Сохранить запись' : 'Создать запись'}
      closable
      destroyOnClose
      okButtonProps={{
        disabled: !troomId || !quotaId,
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="quotaId" hidden>
          <Input />
        </Form.Item>
        <div className={styles.modalBody}>
          <div className={styles.patientSection}>
            <span className={styles.sectionTitle}>Данные пациента</span>
            <div className={`${styles.inputRow} ${styles.cols4}`}>
              <Form.Item
                name="phone"
                label="Номер телефона"
                className={styles.field}
                rules={[
                  { required: true, message: 'Укажите номер телефона' },
                  { pattern: /^\+7\d{10}$/, message: 'Используйте формат +7XXXXXXXXXX' },
                ]}
                getValueFromEvent={(event: ChangeEvent<HTMLInputElement>) =>
                  addRussianPhonePrefix(event.currentTarget.value)
                }
              >
                <Input placeholder="+7XXXXXXXXXX" allowClear />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Фамилия"
                className={styles.field}
                rules={[{ required: true, message: 'Укажите фамилию пациента' }]}
              >
                <Input placeholder="Фамилия" allowClear />
              </Form.Item>
              <Form.Item
                name="firstName"
                label="Имя"
                className={styles.field}
                rules={[{ required: true, message: 'Укажите имя пациента' }]}
              >
                <Input placeholder="Имя" allowClear />
              </Form.Item>
              <Form.Item name="middleName" label="Отчество" className={styles.field}>
                <Input placeholder="Отчество" allowClear />
              </Form.Item>
            </div>
            <div className={`${styles.inputRow} ${styles.cols2}`}>
              <Form.Item name="departmentId" label="Направитель" className={styles.field}>
                <Select
                  placeholder="Выберите направителя"
                  optionFilterProp="label"
                  options={departmentSelectOptions}
                  allowClear
                  showSearch
                />
              </Form.Item>
              <Form.Item name="insuranceTypeId" label="Вид обслуживания" className={styles.field}>
                <Select
                  placeholder="Выберите вид обслуживания"
                  optionFilterProp="label"
                  options={insuranceTypeSelectOptions}
                  allowClear
                  showSearch
                />
              </Form.Item>
            </div>
          </div>
          <div className={styles.schedulerWrapper}>
            <span className={styles.sectionTitle}>Выбранные услуги: {DEFAULT_SERVICES[0].serviceName}</span>
            <div className={styles.schedulerSection}>
              <div className={styles.schedulerLeft}>
                <div>
                  <span className={styles.fieldLabel}>Процедурный кабинет *</span>
                  <Form.Item name="troomId" className={styles.field}>
                    <Select
                      placeholder="Выберите процедурный кабинет"
                      optionFilterProp="children"
                      options={treatmentRoomSelectOptions}
                      className={styles.select}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <AppCalendar
                  mode="slotpicker"
                  selectedDate={currentAppointmentDate}
                  slotCalendar={quotasCalendar}
                  onDateClick={setSelectedDate}
                />
              </div>
              <div className={styles.schedulerRight}>
                <span className={styles.fieldLabel}>Интервал *</span>
                {selectedDateQuotas.length ? (
                  <div className={styles.slotContainer}>
                    <div className={styles.slotGrid}>
                      {selectedDateQuotas.map((slot) => (
                        <SlotCard
                          key={slot.quotaId}
                          slot={slot}
                          isSelected={slot.quotaId === quotaId}
                          action={() => {
                            if (slot.isActive) {
                              form.setFieldValue('quotaId', slot.quotaId);
                            }
                          }}
                          disabled={!slot.isActive}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <Empty
                      description="Выберите дату, чтобы увидеть расписание"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
