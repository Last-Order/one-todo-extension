import { Box, Container, CssBaseline, List, ListSubheader, Stack } from "@mui/material";

function IndexPopup() {
    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    minWidth: "400px",
                    minHeight: "400px",
                }}
            >
                <Stack>
                    <List>
                        <List subheader={<ListSubheader>2023-08-14</ListSubheader>}></List>
                        <List subheader={<ListSubheader>2023-08-15</ListSubheader>}></List>
                    </List>
                </Stack>
            </Box>
        </>
    );
}

export default IndexPopup;
