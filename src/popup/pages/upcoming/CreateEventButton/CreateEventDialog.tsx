import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import useMessage from "~popup/hooks/useMessage";
import React, { useRef, useState } from "react";
import { prepareCreateEvent, type PrepareCreateEventResult } from "../services";
import CreateEventConfirmDialog from "./CreateEventConfirmDialog";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateEventDialog: React.FC<Props> = (props) => {
    const { open, onClose } = props;
    const requestLock = useRef(false);
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [prepareResult, setPrepareResult] = useState<PrepareCreateEventResult>(null);
    const [isShowCreateEventConfirmDialog, setIsShowCreateEventConfirmDialog] = useState(false);
    const [_, { addMessage }] = useMessage();

    const onConfirm = async () => {
        if (!description || requestLock.current) {
            return;
        }
        requestLock.current = true;
        setIsLoading(true);
        try {
            const result = await prepareCreateEvent(description);
            setPrepareResult({ ...result, description });
            setIsShowCreateEventConfirmDialog(true);
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
                    <TextField
                        multiline
                        fullWidth
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        placeholder="Describe your upcoming event in natural language..."
                    ></TextField>
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
                        addMessage("success", "Event added.");
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
