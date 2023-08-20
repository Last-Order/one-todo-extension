import { Box, CssBaseline } from "@mui/material";
import { createHashHistory, Outlet, RootRoute, Route, Router, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { Storage } from "@plasmohq/storage";

import Login from "./pages/login";
import LoginCallback from "./pages/login_callback";

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

const routeTree = rootRoute.addChildren([loginRoute, loginCallbackRoute]);

const hashHistory = createHashHistory();

export const router = new Router({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    const navigate = useNavigate({ from: "/" });
    useEffect(() => {
        (async () => {
            const token = await storage.get("jwt_token");
            if (!token && location.hash === "#/") {
                navigate({ to: "/login" });
            } else {
                console.log("get token:", token);
            }
        })();
    }, [navigate, router]);
    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    minWidth: "400px",
                    minHeight: "400px",
                }}
            >
                <Outlet />
            </Box>
        </>
    );
}

export default App;
