import DoneIcon from "@mui/icons-material/Done";
import { Box, Card, Grid, Paper } from "@mui/material";
import { useParams } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

import { Storage } from "@plasmohq/storage";


import styles from "./index.module.scss";

const storage = new Storage({
    copiedKeyList: ["jwt_token"],
});

const LoginCallback: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useParams();
    useEffect(() => {
        (async () => {
            if (token) {
                await storage.set("jwt_token", token);
                setIsLoading(false);
            }
        })();
    }, [token]);
    return (
        <Box>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={3}>
                    <Card variant="outlined" className={styles.loginCard}>
                        {isLoading ? (
                            <></>
                        ) : (
                            <>
                                <DoneIcon className={styles.successIcon} color="success" />
                                <span>Login success</span>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginCallback;
