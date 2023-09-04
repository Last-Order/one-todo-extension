import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { IconButton, Typography } from "@mui/material";
import classnames from "classnames";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import { updateEventStatus } from "../services";
import { TodoStatus, type TodoEvent } from "../types";
import styles from "./index.module.scss";

interface Props {
    event: TodoEvent;
}

const EventCard: React.FC<Props> = (props) => {
    const { event } = props;
    const { id, event_name, description, scheduled_time, status } = event || {};
    const requestLock = useRef(false);
    const [localStatus, setLocalStatus] = useState<TodoStatus>(status);

    const parsedScheduledTime = useMemo(() => {
        return dayjs(scheduled_time).format("HH:mm");
    }, [scheduled_time]);

    const onCheckClick = async () => {
        if (requestLock.current) {
            return;
        }
        requestLock.current = true;
        const prevStatus = localStatus;
        setLocalStatus(prevStatus === TodoStatus.CREATED ? TodoStatus.DONE : TodoStatus.CREATED);
        try {
            await updateEventStatus(id, prevStatus === TodoStatus.CREATED ? TodoStatus.DONE : TodoStatus.CREATED);
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            // rollback
            setLocalStatus(prevStatus);
        } finally {
            requestLock.current = false;
        }
    };

    return (
        <div
            className={classnames(styles.card, {
                [styles.done]: localStatus === TodoStatus.DONE,
            })}
        >
            <div className={styles.top}>
                <Typography variant="h6" component="div" className={styles.eventName} sx={{ fontSize: "20px" }}>
                    {event_name}
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary" className={styles.description}>
                    {description}
                </Typography>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.bottom}>
                <Typography component="div" color="text.secondary" className={styles.time}>
                    {parsedScheduledTime}
                </Typography>
                <div className={styles.actions}>
                    <IconButton onClick={onCheckClick}>
                        {localStatus === TodoStatus.CREATED ? (
                            <CheckCircleOutlineIcon color="primary" />
                        ) : (
                            <CheckCircleIcon color="primary" />
                        )}
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
