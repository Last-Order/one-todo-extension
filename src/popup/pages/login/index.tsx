import { Grid } from "@mui/material";
import btn from "./images/btn_google_signin_dark_normal_web@2x.png";
import styles from "./index.module.scss";

function Login() {
    const onGoogleLoginClick = () => {
        const loginUrl = `${process.env.PLASMO_PUBLIC_API_BASE}/oauth/google/login`;
        const params = new URLSearchParams();
        const currentUrl = new URL(location.href);
        params.append("return_url", `${currentUrl.origin}${currentUrl.pathname}#/login_callback`);
        const finalUrl = `${loginUrl}?${params.toString()}`;
        window.open(finalUrl);
    };
    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
            <Grid item>
                <img src={btn} className={styles.googleBtn} onClick={onGoogleLoginClick} />
            </Grid>
        </Grid>
    );
}

export default Login;
