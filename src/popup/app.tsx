import { Box, CssBaseline } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Storage } from "@plasmohq/storage";
import { createHashHistory, Outlet, RootRoute, Route, Router, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { RecoilRoot } from "recoil";
import GlobalMessage from "./components/GlobalMessage";
import Login from "./pages/login";
import LoginCallback from "./pages/login_callback";
import Upcoming from "./pages/upcoming";

const storage = new Storage({
    copiedKeyList: ["jwt_token"],
});

const rootRoute = new RootRoute({
    component: App,
});

const loginRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: Login,
});

const loginCallbackRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/login_callback/$token",
    component: LoginCallback,
});

const upcomingRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/upcoming",
    component: Upcoming,
});

const routeTree = rootRoute.addChildren([loginRoute, loginCallbackRoute, upcomingRoute]);

const hashHistory = createHashHistory();

export const router = new Router({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    const isInited = useRef(false);
    const navigate = useNavigate({ from: "/" });
    useEffect(() => {
        if (isInited.current) {
            return;
        }
        isInited.current = true;
        (async () => {
            const token = await storage.get("jwt_token");
            if (location.hash !== "#/") {
                return;
            }
            if (!token) {
                navigate({ to: "/login" });
            } else {
                navigate({ to: "/upcoming" });
            }
        })();
    }, [navigate, router]);
    return (
        <RecoilRoot>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <GlobalMessage />
                <Box
                    sx={{
                        minWidth: "450px",
                        minHeight: "520px",
                    }}
                >
                    <Outlet />
                </Box>
            </LocalizationProvider>
        </RecoilRoot>
    );
}

export default App;
