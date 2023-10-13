import DoneIcon from "@mui/icons-material/Done";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { SubscriptionType } from "~popup/constants";
import useMessage from "~popup/hooks/useMessage";
import React, { useCallback, useRef, useState } from "react";
import { createOrder, type UserProfileResponse } from "../services";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    subscription: UserProfileResponse["subscription"];
    onClose: () => void;
}

const SubscriptionManageDialog: React.FC<Props> = (props) => {
    const { open, subscription, onClose } = props;
    const { subscription_type: subscriptionType } = subscription || {};
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const requestLock = useRef(false);
    const [_, { addMessage }] = useMessage();

    const onDialogClose = useCallback(
        (e: React.MouseEvent<HTMLDialogElement> | React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
        },
        [onClose],
    );

    const onSubscription = useCallback(async () => {
        if (requestLock.current) {
            return;
        }
        setIsCreatingOrder(true);
        requestLock.current = true;
        try {
            const response = await createOrder();
            const { checkout_url: checkoutUrl } = response;
            chrome.tabs.create({ url: checkoutUrl });
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            requestLock.current = false;
            setIsCreatingOrder(false);
        }
    }, []);

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
                                <LoadingButton
                                    loading={isCreatingOrder}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ whiteSpace: "nowrap" }}
                                    onClick={onSubscription}
                                >
                                    Upgrade $4.99 / Month
                                </LoadingButton>
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
