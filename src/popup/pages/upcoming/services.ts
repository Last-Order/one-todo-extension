import request from "~popup/utils/request";
import dayjs from "dayjs";
import type { TodoEvent, TodoStatus } from "./types";

export const getUpcomingEvents = async () => {
    return await request.get<TodoEvent[]>("/upcoming", {
        current_time: dayjs().format(),
    });
};

export const updateEventStatus = async (eventId: number, status: TodoStatus) => {
    return await request.post("/update_event_status", {
        id: eventId,
        status,
    });
};
