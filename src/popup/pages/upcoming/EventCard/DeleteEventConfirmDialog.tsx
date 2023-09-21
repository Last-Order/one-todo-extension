import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import useMessage from "~popup/hooks/useMessage";
import React, { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { deleteEvent } from "../services";
import type { TodoEvent } from "../types";

interface Props {
    open: boolean;
    event: TodoEvent;
    onClose: () => void;
}

const DeleteEventConfirmDialog: React.FC<Props> = (props) => {
    const { open, event, onClose } = props;
    const [isLoading, setIsLoading] = useState(false);
    const requestLock = useRef(false);
    const [_, { addMessage }] = useMessage();
    const { mutate } = useSWRConfig();
    const onCancel = () => {
        onClose();
    };
    const onConfirm = async () => {
        if (requestLock.current) {
            return;
        }
        setIsLoading(true);
        try {
            await deleteEvent({ id: event.id });
            mutate("upcoming_events", (currentEvents: TodoEvent[]) => {
                const index = currentEvents.findIndex((e) => e.id === event.id);
                if (index === -1) {
                    return [];
                }
                return [...currentEvents.slice(0, index), ...currentEvents.slice(index + 1)];
            });
            addMessage("success", "Event deleted");
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setIsLoading(false);
            requestLock.current = false;
        }
    };
    return (
        <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogActions>
                <Button color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <LoadingButton color="warning" loading={isLoading} onClick={onConfirm}>
                    Confirm
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteEventConfirmDialog;
