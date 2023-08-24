import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import CreateEventDialog from "./CreateEventDialog";
import styles from "./index.module.scss";

const CreateEventButton: React.FC = () => {
    const [isShowCreateEventDialog, setIsShowCreateEventDialog] = useState(false);
    return (
        <div className={styles.container}>
            <IconButton
                color="primary"
                size="large"
                sx={{
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    ":hover": { backgroundColor: "primary.light" },
                    boxShadow: 3,
                }}
                onClick={() => {
                    setIsShowCreateEventDialog(true);
                }}
            >
                <AddIcon></AddIcon>
            </IconButton>
            <CreateEventDialog open={isShowCreateEventDialog}></CreateEventDialog>
        </div>
    );
};

export default CreateEventButton;
