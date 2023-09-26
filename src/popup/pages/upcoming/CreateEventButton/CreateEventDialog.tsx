import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import useMessage from "~popup/hooks/useMessage";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { createEvent, prepareCreateEvent, type PrepareCreateEventResult } from "../services";
import type { TodoEvent } from "../types";
import CreateEventConfirmDialog from "./CreateEventConfirmDialog";
import styles from "./index.module.scss";

enum CreateMode {
    AI,
    MANUALLY,
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateEventDialog: React.FC<Props> = (props) => {
    const { open, onClose } = props;
    const requestLock = useRef(false);
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [scheduledTime, setScheduledTime] = useState<dayjs.Dayjs>(null);
    const [createMode, setCreateMode] = useState(CreateMode.AI);
    const [isLoading, setIsLoading] = useState(false);
    const [prepareResult, setPrepareResult] = useState<PrepareCreateEventResult>(null);
    const [isShowCreateEventConfirmDialog, setIsShowCreateEventConfirmDialog] = useState(false);
    const { mutate } = useSWRConfig();
    const [_, { addMessage }] = useMessage();

    const onConfirm = async () => {
        if (requestLock.current) {
            return;
        }
        if (createMode === CreateMode.AI) {
            if (!description) {
                return addMessage("error", "A description of the event is required.");
            }
        }
        if (createMode === CreateMode.MANUALLY) {
            if (!eventName) {
                return addMessage("error", "An event name is required.");
            }
            if (!scheduledTime || !scheduledTime.isValid()) {
                return addMessage("error", "An valid scheduled time is required.");
            }
        }
        requestLock.current = true;
        setIsLoading(true);
        try {
            if (createMode === CreateMode.AI) {
                const result = await prepareCreateEvent(description);
                setPrepareResult({ ...result, description });
                setIsShowCreateEventConfirmDialog(true);
            } else {
                const remindTime = dayjs(scheduledTime).subtract(30, "minutes");
                const newEvent = await createEvent({
                    eventName: eventName,
                    scheduledTime: scheduledTime.format(),
                    remindTime: remindTime.format(),
                    description: description,
                });
                mutate("upcoming_events", (currentEvents: TodoEvent[]) => {
                    return [...currentEvents, newEvent];
                });
                // reset form
                setEventName("");
                setDescription("");
                setScheduledTime(null);
                addMessage("success", "Event created.");
                onClose();
            }
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
            <DialogTitle>Create Event</DialogTitle>
            <DialogContent>
                <div className={styles.form}>
                    <FormControl fullWidth>
                        {createMode === CreateMode.AI ? (
                            <TextField
                                multiline
                                fullWidth
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                placeholder="Describe your upcoming event in natural language..."
                            ></TextField>
                        ) : (
                            <>
                                <TextField
                                    label="Event Name"
                                    fullWidth
                                    value={eventName}
                                    onChange={(e) => {
                                        setEventName(e.target.value);
                                    }}
                                ></TextField>
                                <br />
                                <TextField
                                    label="Description"
                                    multiline
                                    fullWidth
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                ></TextField>
                                <br />
                                <DateTimeField
                                    ampm={false}
                                    value={scheduledTime}
                                    format="YYYY-MM-DD HH:mm"
                                    onChange={(time) => {
                                        setScheduledTime(time);
                                    }}
                                    label="Scheduled Time"
                                    size="small"
                                ></DateTimeField>
                            </>
                        )}
                    </FormControl>
                    {createMode === CreateMode.AI && (
                        <Button
                            sx={{ marginTop: "4px" }}
                            onClick={() => {
                                setCreateMode(CreateMode.MANUALLY);
                            }}
                        >
                            Or Create Manually
                        </Button>
                    )}
                </div>
                <CreateEventConfirmDialog
                    key={JSON.stringify(prepareResult)}
                    open={isShowCreateEventConfirmDialog}
                    prepareResult={prepareResult}
                    onClose={() => {
                        setIsShowCreateEventConfirmDialog(false);
                    }}
                    onCreated={() => {
                        setIsShowCreateEventConfirmDialog(false);
                        addMessage("success", "Event created.");
                        onClose();
                    }}
                />
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={isLoading} color="primary" onClick={onConfirm}>
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEventDialog;
