import LogoutIcon from "@mui/icons-material/Logout";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    LinearProgress,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Tooltip,
    Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import auth from "~utils/auth";
import React, { useState } from "react";
import useSWR from "swr";
import { getUserProfile } from "../services";
import styles from "./index.module.scss";
import SubscriptionManageDialog from "./SubscriptionManageDialog";

const DEFAULT_AVATAR_URL = "https://www.gravatar.com/avatar/00000000000000000000000000000000.jpg?d=mp&f=y";

const UserProfile: React.FC = () => {
    const { data } = useSWR("user_profile", getUserProfile);
    const { avatar, last_name: lastName, first_name: firstName, subscription, quota_info: quotaInfo } = data || {};
    const { quota, used_count: usedCount } = quotaInfo || {};
    const { subscription_name: subscriptionName } = subscription || {};
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [isShowSubscriptionManageDialog, setIsShowSubscriptionManageDialog] = useState(false);
    const navigate = useNavigate();

    const ratio = (() => {
        if (!quota || !usedCount) {
            return 0;
        }
        return (usedCount / quota) * 100;
    })();

    const onUserAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(e.currentTarget);
    };

    const onMenuClose = () => {
        setAnchorElUser(null);
    };

    const onLogout = async () => {
        await auth.logout();
        navigate({ to: "/login" });
    };

    return (
        <div style={{ position: "relative" }}>
            <Tooltip title="Settings">
                <IconButton color="inherit" onClick={onUserAvatarClick} sx={{ p: 0 }}>
                    <Avatar src={avatar || DEFAULT_AVATAR_URL} sx={{ width: "32px", height: "32px" }} />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ marginTop: "35px" }}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: "160px",
                            maxWidth: "160px",
                        },
                    },
                }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={onMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                disableScrollLock={true}
            >
                <MenuList dense sx={{ paddingTop: "0" }}>
                    <MenuItem>
                        <div className={styles.name}>
                            {firstName}
                            {lastName ? ` ${lastName}` : ""}
                        </div>
                    </MenuItem>
                    <MenuItem
                        sx={{ height: "48px" }}
                        onClick={() => {
                            setIsShowSubscriptionManageDialog(true);
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
                            <Box sx={{ width: "100%" }}>
                                <LinearProgress variant="determinate" value={ratio} />
                            </Box>
                            <Box sx={{ marginTop: "6px", textAlign: "right", width: "100%" }}>
                                <div className={styles.subscription}>
                                    <div className={styles.subscriptionName}>
                                        <Typography color="text.secondary" fontSize={12}>
                                            {subscriptionName}
                                        </Typography>
                                    </div>
                                    <div className={styles.quota}>
                                        <Typography color="text.secondary" fontSize={12}>
                                            {usedCount} / {quota}
                                        </Typography>
                                    </div>
                                </div>
                            </Box>
                        </Box>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={onLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
            <SubscriptionManageDialog
                open={isShowSubscriptionManageDialog}
                subscription={subscription}
                onClose={() => {
                    setIsShowSubscriptionManageDialog(false);
                }}
            />
        </div>
    );
};

export default UserProfile;
