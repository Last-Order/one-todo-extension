import { Alert, Box, Card, CircularProgress, Grid, Paper } from "@mui/material";
import { useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { checkOrderStatus, OrderStatus } from "./services";

let counter = 0;
const MAX_RETRIES = 10;

const OrderCallback: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const { token } = useParams();
    useEffect(() => {
        (async () => {
            if (!token) {
                return;
            }
            const check = async () => {
                const order = await checkOrderStatus(token);
                if (order.status === OrderStatus.Finished) {
                    setIsLoading(false);
                } else {
                    counter++;
                    if (counter < MAX_RETRIES) {
                        setTimeout(check, 3000);
                    } else {
                        setIsError(true);
                        setIsLoading(false);
                    }
                }
            };
            check();
        })();
    }, [token]);
    return (
        <Box sx={{ marginTop: "20px" }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={3}>
                    <Card variant="outlined" className={styles.loginCard}>
                        {isLoading ? (
                            <div className={styles.loadingContainer}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                {isError ? (
                                    <>
                                        <Alert severity="error">
                                            Something went wrong. Please try again or contact todo-help@moesound.org.
                                        </Alert>
                                    </>
                                ) : (
                                    <>
                                        <Alert severity="success">
                                            <span>Payment success</span>
                                        </Alert>
                                    </>
                                )}
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderCallback;
