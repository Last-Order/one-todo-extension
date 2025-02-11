import {
    AppBar,
    Box,
    CircularProgress,
    Container,
    List,
    ListSubheader,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import React, { useMemo } from "react";
import useSWR from "swr";
import CreateEventButton from "./CreateEventButton";
import EventCard from "./EventCard";
import styles from "./index.module.scss";
import { getUpcomingEvents } from "./services";
import type { TodoEvent } from "./types";
import UserProfile from "./UserProfile";

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
            <Container>
                <AppBar component="nav" variant="outlined">
                    <Toolbar variant="dense">
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" color="inherit" component="div">
                                Upcoming Events
                            </Typography>
                        </Box>
                        <Box>
                            <UserProfile />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Container>
            {isLoading && (
                <div className={styles.loadingContainer}>
                    <CircularProgress />
                </div>
            )}
            {!isLoading && !groupedEvents.length && (
                <div className={styles.emptyTip}>
                    <Typography>All done! Waiting for new upcoming events...</Typography>
                </div>
            )}
            <Stack sx={{ marginTop: "48px" }}>
                {groupedEvents.map((group, index) => {
                    return (
                        <List
                            key={index}
                            className={styles.eventList}
                            subheader={
                                <>
                                    <ListSubheader>
                                        <Typography sx={{ margin: "4px 0" }}>
                                            {dayjs(group.date).toDate().toLocaleDateString()}
                                        </Typography>
                                    </ListSubheader>
                                </>
                            }
                        >
                            {group.events.map((event) => {
                                return <EventCard event={event} key={event.id} />;
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
