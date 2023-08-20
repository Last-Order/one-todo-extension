import { CssBaseline } from "@mui/material";
import { RouterProvider } from "@tanstack/react-router";

import App, { router } from "./app";

function Root() {
    return (
        <>
            <CssBaseline />
            <RouterProvider router={router} />
        </>
    );
}

export default Root;
