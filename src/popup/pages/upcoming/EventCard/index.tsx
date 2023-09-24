import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import classnames from "classnames";
import dayjs from "dayjs";
import React, { useMemo, useRef, useState } from "react";
import { updateEventStatus } from "../services";
import { TodoStatus, type TodoEvent } from "../types";
import DeleteEventConfirmDialog from "./DeleteEventConfirmDialog";
import EditEventDialog from "./EditEventDialog";
import EventDetailDialog from "./EventDetailDialog";
import styles from "./index.module.scss";

interface Props {
    event: TodoEvent;
}

const EventCard: React.FC<Props> = (props) => {
    const { event } = props;
    const { id, event_name, description, scheduled_time, status } = event || {};
    const requestLock = useRef(false);
    const [localStatus, setLocalStatus] = useState<TodoStatus>(status);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isShowEditDialog, setIsShowEditDialog] = useState(false);
    const [isShowDeleteConfirmDialog, setIsShowDeleteConfirmDialog] = useState(false);
    const [isShowEventDetailDialog, setIsShowEventDetailDialog] = useState(false);

    const parsedScheduledTime = useMemo(() => {
        return dayjs(scheduled_time).format("HH:mm");
    }, [scheduled_time]);

    const onCheckClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
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

    const onEditButtonClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setIsShowEditDialog(true);
    };

    const onDeleteButtonClick = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        setIsShowDeleteConfirmDialog(true);
    };

    const onCardClick = () => {
        setIsShowEventDetailDialog(true);
    };

    const onMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div
                className={classnames(styles.card, {
                    [styles.done]: localStatus === TodoStatus.DONE,
                })}
                onClick={onCardClick}
            >
                <div className={styles.top}>
                    <div className={styles.topLine}>
                        <Typography variant="h6" component="div" className={styles.eventName} sx={{ fontSize: "20px" }}>
                            {event_name}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                    <Typography variant="body2" component="div" color="text.secondary" className={styles.description}>
                        {description}
                    </Typography>
                    <Menu
                        sx={{ paddingTop: "0px", paddingBottom: "0px" }}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={onMenuClose}
                        disableScrollLock={true}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuList dense disablePadding>
                            <MenuItem onClick={onEditButtonClick}>
                                <Typography color="primary.main" fontSize={14}>
                                    Edit
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={onDeleteButtonClick}>
                                <Typography color="warning.main" fontSize={14}>
                                    Delete
                                </Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>
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
            <EditEventDialog
                open={isShowEditDialog}
                onClose={() => {
                    setIsShowEditDialog(false);
                    setAnchorEl(null);
                }}
                event={event}
                key={`${JSON.stringify(event)}-edit`}
            />
            <DeleteEventConfirmDialog
                open={isShowDeleteConfirmDialog}
                onClose={() => {
                    setIsShowDeleteConfirmDialog(false);
                    setAnchorEl(null);
                }}
                event={event}
                key={`${JSON.stringify(event)}-delete`}
            />
            <EventDetailDialog
                open={isShowEventDetailDialog}
                event={event}
                key={`${JSON.stringify(event)}-detail`}
                onClose={() => {
                    console.log(1);
                    setIsShowEventDetailDialog(false);
                }}
            />
        </>
    );
};

export default EventCard;
