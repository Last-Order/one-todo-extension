import { AppBar, Box, List, ListItemButton, ListSubheader, Stack, Toolbar, Typography } from "@mui/material";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import React, { useMemo } from "react";
import useSWR from "swr";
import CreateEventButton from "./CreateEventButton";
import { getUpcomingEvents } from "./services";
import type { TodoEvent } from "./services";

const Upcoming: React.FC = () => {
    const { data: events, isLoading } = useSWR("upcoming_events", getUpcomingEvents);
    const groupedEvents = useMemo<{ date: string; events: TodoEvent[] }[]>(() => {
        if (!events?.length) {
            return [];
        }
        const result = Object.entries(
            groupBy(events, (ev: TodoEvent) => dayjs(ev.scheduled_time).format("YYYY-MM-DD")),
        ).map(([date, events]) => ({
            date,
            events: events as TodoEvent[],
        }));
        return result;
    }, [events]);
    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <AppBar component="nav" variant="outlined">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div">
                        Upcoming Events
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack sx={{ marginTop: "48px" }}>
                {groupedEvents.map((group) => {
                    return (
                        <List
                            subheader={
                                <>
                                    <ListSubheader>{dayjs(group.date).toDate().toLocaleDateString()}</ListSubheader>
                                </>
                            }
                        >
                            {group.events.map((event) => {
                                return <ListItemButton>{event.title}</ListItemButton>;
                            })}
                        </List>
                    );
                })}
            </Stack>
            <CreateEventButton />
        </Box>
    );
};

export default Upcoming;
