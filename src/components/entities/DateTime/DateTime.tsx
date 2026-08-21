import { Flex } from "antd";
import styles from "./DateTime.module.scss"
import { FC } from "react";


interface IDatetime {
  datetime: Date;
}

export const DateTime: FC<IDatetime> = ({datetime}) => {
    const date = datetime.toLocaleDateString();
    const time = datetime.toLocaleTimeString();

    return (
        <Flex className={styles.dateTime}>
            <span className={styles.date}>{date}</span>
            <span className={styles.time}>{time}</span>
        </Flex>
    )
}