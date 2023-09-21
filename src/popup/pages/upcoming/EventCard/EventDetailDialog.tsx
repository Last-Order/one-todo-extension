import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import type { TodoEvent } from "../types";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    event: TodoEvent;
    onClose: () => void;
}

const EventDetailDialog: React.FC<Props> = (props) => {
    const { open, event, onClose } = props;
    const { scheduled_time: scheduledTime, event_name: eventName, description } = event || {};
    const parsedScheduledTime = useMemo(() => {
        if (!scheduledTime) {
            return "";
        }
        return dayjs(scheduledTime).toDate().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    }, [scheduledTime]);
    return (
        <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose} disableScrollLock={true}>
            {/* <DialogTitle>Event Detail</DialogTitle> */}
            <DialogContent>
                <div className={classNames(styles.sectionTitle, styles.eventName)}>Event Name</div>
                <div className={styles.sectionContent}>{eventName || ""}</div>
                <div className={classNames(styles.sectionTitle)}>Scheduled Time</div>
                <div className={styles.sectionContent}>{parsedScheduledTime}</div>
                <div className={classNames(styles.sectionTitle)}>Event Description</div>
                <div className={styles.sectionContent}>{description || ""}</div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventDetailDialog;
