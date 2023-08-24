import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
}

const CreateEventDialog: React.FC<Props> = (props) => {
    const { open } = props;
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Create Event</DialogTitle>
            <DialogContent>
                <div className={styles.form}>
                    <TextField multiline fullWidth></TextField>
                </div>
            </DialogContent>
            <DialogActions>
                <LoadingButton color="primary">Confirm</LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEventDialog;
