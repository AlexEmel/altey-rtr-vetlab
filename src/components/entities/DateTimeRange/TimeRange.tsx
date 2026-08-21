import { FC } from "react";
import styles from "./TimeRange.module.scss"
import { Flex } from "antd";

export interface IDateTimeRange {
    startDatetime: Date;
    endDatetime: Date;
}

export const TimeRange: FC<IDateTimeRange> = ({startDatetime, endDatetime}) => {
    const startTime = startDatetime.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const endTime = endDatetime.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <Flex className={styles.timeRange}>
            <span className={styles.time}>{startTime} - {endTime}</span>
        </Flex>
    )
}