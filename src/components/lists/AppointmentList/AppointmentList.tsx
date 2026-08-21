import { AppointmentStatusTag } from '@/components/entities/AppointmentStatusTag/AppointmentStatusTag';
import { DateTime } from '@/components/entities/DateTime/DateTime';
import { TimeRange } from '@/components/entities/DateTimeRange/TimeRange';
import {
  confirmAppointment,
  deleteAppointment,
  setAppointmentModalMode,
  setCurrentAppointment,
  setCurrentPage,
  setShowAppointmentModal,
} from '@/features/appointments.slice';
import { EAppointmentStatus, IAppointment } from '@/interfaces/entities/appointment.interface';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { getPatientFullName } from '@/utils/common.util';
import { CheckSquareOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Flex, Popconfirm, Table, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import { ReactNode, useMemo } from 'react';

export const AppointmentList = (): JSX.Element => {
  const { appointments, currentPage, isLoading } = useAppSelector((store) => store.appointments);
  const departments = useAppSelector((store) => store.dictionaries.departments);
  const insuranceTypes = useAppSelector((store) => store.dictionaries.insuranceTypes);
  const dispatch = useAppDispatch();

  const departmentNames = useMemo(
    () => new Map(departments.map((department) => [department._id, department.name])),
    [departments],
  );

  const insuranceTypeNames = useMemo(
    () => new Map(insuranceTypes.map((insuranceType) => [insuranceType._id, insuranceType.name])),
    [insuranceTypes],
  );

  const handlePageChange = (page: number): void => {
    dispatch(setCurrentPage(page));
  };

  const handleOpenAppointment = (appointment: IAppointment): void => {
    dispatch(setCurrentAppointment(appointment));
    dispatch(setAppointmentModalMode('edit'));
    dispatch(setShowAppointmentModal(true));
  };

  const renderActionButtons = (appointment: IAppointment): ReactNode => {
    const isConfirmed = appointment.status === EAppointmentStatus.CONFIRMED;

    return (
      <Flex gap={5} onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Подтвердить запись" mouseEnterDelay={0.4}>
          <Popconfirm
            title="Подтверждение записи"
            description="Подтвердить запись на прием?"
            okText="Да"
            cancelText="Нет"
            onConfirm={() => dispatch(confirmAppointment(appointment._id))}
            disabled={isConfirmed}
          >
            <Button icon={<CheckSquareOutlined />} disabled={isConfirmed}></Button>
          </Popconfirm>
        </Tooltip>
        <Tooltip title="Редактировать запись" mouseEnterDelay={0.4}>
          <Button icon={<EditOutlined />} onClick={() => handleOpenAppointment(appointment)}></Button>
        </Tooltip>
        <Tooltip title="Удалить запись" mouseEnterDelay={0.4}>
          <Popconfirm
            title={`Удалить запись`}
            description={'Вы уверены, что хотите удалить запись в процедурный кабинет?'}
            okText="Да"
            cancelText="Нет"
            onConfirm={() => dispatch(deleteAppointment(appointment._id))}
          >
            <Button icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Tooltip>
      </Flex>
    );
  };

  return (
    <Table
      dataSource={appointments}
      rowKey={'_id'}
      loading={isLoading}
      onRow={(record) => ({
        onClick: () => handleOpenAppointment(record),
      })}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        current: currentPage || 1,
        onChange: handlePageChange,
      }}
      size="middle"
    >
      <Column
        title="Дата создания"
        key="datetime"
        render={(_, record: IAppointment) => <DateTime datetime={new Date(record.datetime)} />}
        width={50}
      />
      <Column
        title="Дата квоты"
        key="quotaDatetime"
        render={(_, record: IAppointment) => (
          <span>{new Date(record.quota.workDay).toLocaleDateString()}</span>
        )}
        width={100}
      />
      <Column
        title="Время квоты"
        key="quotaDatetime"
        render={(_, record: IAppointment) => (
          <TimeRange
            startDatetime={new Date(record.quota.quotaStart)}
            endDatetime={new Date(record.quota.quotaEnd)}
          />
        )}
        width={100}
      />
      <Column
        title="Статус"
        key="status"
        render={(_, record: IAppointment) => <AppointmentStatusTag status={record.status} />}
        width={120}
      />
      <Column
        title="Пациент"
        key="patientFullName"
        render={(_, record) => (
          <Flex>
            <span>{getPatientFullName(record.patient)}</span>
          </Flex>
        )}
        width={250}
      />
      <Column title="Телефон" key="phone" dataIndex={['patient', 'phone']} width={100} />
      <Column
        title="Процедурный кабинет"
        key="treatmentRoom"
        render={(_, record) => record.troomName}
        width={200}
      />
      <Column
        title="Направитель"
        key="department"
        render={(_, record: IAppointment) =>
          record.departmentId ? (departmentNames.get(record.departmentId) ?? record.departmentId) : '—'
        }
        width={200}
      />
      <Column
        title="Вид обслуживания"
        key="insuranceType"
        render={(_, record: IAppointment) =>
          record.insuranceTypeId
            ? (insuranceTypeNames.get(record.insuranceTypeId) ?? record.insuranceTypeId)
            : '—'
        }
        width={150}
      />
      <Column title="Сотрудник" key="createdBy" render={(_, record) => record.createdBy} width={150} />
      <Column
        width={50}
        title="Действия"
        render={(_, record: IAppointment) => renderActionButtons(record)}
      ></Column>
    </Table>
  );
};
