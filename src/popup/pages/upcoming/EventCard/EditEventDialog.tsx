import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import useMessage from "~popup/hooks/useMessage";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { updateEvent } from "../services";
import type { TodoEvent } from "../types";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    onClose: () => void;
    event: TodoEvent;
}

const EditEventDialog: React.FC<Props> = (props) => {
    const { open, event, onClose } = props;
    const {
        id,
        event_name: eventName,
        description,
        scheduled_time: scheduledTime,
        remind_time: remindTime,
    } = event || {};
    const [localEventName, setLocalEventName] = useState(eventName);
    const [localDescription, setLocalDescription] = useState(description);
    const [localScheduledTime, setLocalScheduledTime] = useState(dayjs(scheduledTime));
    const [localRemindTime, setLocalRemindTime] = useState(dayjs(remindTime));
    const [isLoading, setIsLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const { mutate } = useSWRConfig();

    const requestLock = useRef(false);

    const onConfirm = async () => {
        if (requestLock.current) {
            return;
        }
        if (!localEventName) {
            return addMessage("error", "A name of the event is required.");
        }
        setIsLoading(true);
        try {
            const updatedEvent = await updateEvent({
                id,
                eventName: localEventName,
                description: localDescription,
                scheduledTime: localScheduledTime.format(),
                remindTime: localRemindTime.format(),
            });
            mutate("upcoming_events", (currentEvents: TodoEvent[]) => {
                const index = currentEvents.findIndex((e) => e.id === id);
                if (index === -1) {
                    return [];
                }
                return [...currentEvents.slice(0, index), updatedEvent, ...currentEvents.slice(index + 1)];
            });
            addMessage("success", "Event information saved.");
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            requestLock.current = false;
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
                <div className={styles.form}>
                    <FormControl fullWidth>
                        <TextField
                            label="Event Name"
                            fullWidth
                            value={localEventName}
                            onChange={(e) => {
                                setLocalEventName(e.target.value);
                            }}
                        ></TextField>
                        <br />
                        <TextField
                            label="Description"
                            multiline
                            maxRows={3}
                            value={localDescription}
                            onChange={(e) => {
                                setLocalDescription(e.target.value);
                            }}
                        ></TextField>
                        <br />
                        <DateTimeField
                            ampm={false}
                            value={localScheduledTime}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(time) => {
                                setLocalScheduledTime(time);
                            }}
                            label="Scheduled Time"
                            size="small"
                        ></DateTimeField>
                        <br />
                        <DateTimeField
                            ampm={false}
                            value={localRemindTime}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(time) => {
                                setLocalRemindTime(time);
                            }}
                            label="Remind Time"
                            size="small"
                        ></DateTimeField>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton color="primary" loading={isLoading} onClick={onConfirm}>
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
