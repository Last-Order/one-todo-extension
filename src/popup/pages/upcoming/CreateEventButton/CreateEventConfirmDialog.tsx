import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import useMessage from "~popup/hooks/useMessage";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { createEvent, type PrepareCreateEventResult } from "../services";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    prepareResult: PrepareCreateEventResult;
    onClose: () => void;
    onCreated?: () => void;
}

const CreateEventConfirmDialog: React.FC<Props> = (props) => {
    const { open, prepareResult, onClose, onCreated } = props;
    const { event_name: eventName, scheduled_time: scheduledTime, description } = prepareResult || {};
    const [localEventName, setLocalEventName] = useState(eventName);
    const [localScheduledTime, setLocalScheduledTime] = useState(dayjs(scheduledTime));
    const [localDescription, setLocalDescription] = useState(description);
    const [isLoading, setIsLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const { mutate } = useSWRConfig();
    const requestLock = useRef(false);

    const onConfirm = async () => {
        if (!localEventName) {
            return addMessage("error", "Event name cannot be empty.");
        }
        if (requestLock.current) {
            return;
        }
        requestLock.current = true;
        setIsLoading(true);

        const remindTime = dayjs(localScheduledTime).subtract(30, "minutes");
        try {
            await createEvent({
                eventName: localEventName,
                scheduledTime: localScheduledTime.format(),
                remindTime: remindTime.format(),
                description: localDescription,
            });
            mutate("upcoming_events");
            onCreated && onCreated();
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
            <DialogTitle>Confirm Event</DialogTitle>
            <DialogContent>
                <div className={styles.form}>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            value={eventName}
                            label="Event Name"
                            size="small"
                            onChange={(e) => {
                                setLocalEventName(e.target.value);
                            }}
                        />
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
                        />
                        <br />
                        <TextField
                            fullWidth
                            multiline
                            value={description}
                            maxRows={3}
                            label="Description"
                            size="small"
                            onChange={(e) => {
                                setLocalDescription(e.target.value);
                            }}
                        />
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={isLoading} onClick={onConfirm}>
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEventConfirmDialog;
