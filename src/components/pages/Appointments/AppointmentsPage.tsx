import AppointmentModal from "@/components/entities/CreateAppointmentModal/AppointmentModal";
import { AppointmentFilters } from "@/components/forms/AppointmentFilters/AppointmentFilters";
import { setAppointmentModalMode, setShowAppointmentModal } from "@/features/appointments.slice";
import { useAppDispatch } from "@/store/store";
import { Flex } from "antd";
import styles from './AppointmentsPage.module.scss';
import { AppointmentList } from "@/components/lists/AppointmentList/AppointmentList";

export const AppointmentsPage = (): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <Flex vertical className={styles.appointmentsPage}>
      <AppointmentFilters
        onCreateAppointment={() => {
          dispatch(setAppointmentModalMode('new'));
          dispatch(setShowAppointmentModal(true));
        }}
      />
      <AppointmentList />
      <AppointmentModal />
    </Flex>
  );
}
