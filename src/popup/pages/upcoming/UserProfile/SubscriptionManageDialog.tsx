import DoneIcon from "@mui/icons-material/Done";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { SubscriptionType } from "~popup/constants";
import React, { useCallback } from "react";
import type { UserProfileResponse } from "../services";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    subscription: UserProfileResponse["subscription"];
    onClose: () => void;
}

const SubscriptionManageDialog: React.FC<Props> = (props) => {
    const { open, subscription, onClose } = props;
    const { subscription_type: subscriptionType } = subscription || {};

    const onDialogClose = useCallback(
        (e: React.MouseEvent<HTMLDialogElement> | React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
        },
        [onClose],
    );
    return (
        <Dialog open={open} onClose={onDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle>Subscription</DialogTitle>
            <DialogContent>
                <div className={styles.subscriptionList}>
                    <div className={styles.subscriptionItem}>
                        <Typography
                            className={styles.subscriptionTitle}
                            color="text.secondary"
                            component="div"
                            fontSize={22}
                        >
                            Free
                        </Typography>
                        <ul className={styles.subscriptionFeatureList}>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    20 events per month
                                </Typography>
                            </li>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    GPT-3.5 extraction
                                </Typography>
                            </li>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    No support.
                                </Typography>
                            </li>
                        </ul>
                        {subscriptionType === SubscriptionType.FREE_PLAN && (
                            <Typography
                                color="text.secondary"
                                sx={{ textAlign: "center", paddingTop: "8px" }}
                                fontSize={14}
                            >
                                Current Plan
                            </Typography>
                        )}
                    </div>
                    <div className={styles.subscriptionItem}>
                        <Typography
                            className={styles.subscriptionTitle}
                            color="primary.main"
                            component="div"
                            fontSize={22}
                        >
                            Pro
                        </Typography>
                        <ul className={styles.subscriptionFeatureList}>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} color="success" />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    125 events per month
                                </Typography>
                            </li>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} color="success" />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    GPT-4 extraction
                                </Typography>
                            </li>
                            <li className={styles.subscriptionFeatureItem}>
                                <DoneIcon fontSize="small" className={styles.subscriptionIcon} color="success" />
                                <Typography color="text.secondary" component="span" fontSize={14}>
                                    Email support
                                </Typography>
                            </li>
                        </ul>
                        {subscriptionType !== SubscriptionType.PRO_PLAN ? (
                            <div className={styles.subscriptionUpgrade}>
                                <Button fullWidth variant="contained" color="primary" sx={{ whiteSpace: "nowrap" }}>
                                    Upgrade $4.99 / Month
                                </Button>
                            </div>
                        ) : (
                            <Typography color="text.secondary" sx={{ textAlign: "center" }} fontSize={14}>
                                Current Plan
                            </Typography>
                        )}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onDialogClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubscriptionManageDialog;
