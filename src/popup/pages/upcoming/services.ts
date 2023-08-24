import request from "~popup/utils/request";

export interface TodoEvent {
    title: string;
    description: string;
    scheduled_time: string;
    remind_time: string;
}

export const getUpcomingEvents = async () => {
    return await request.get<TodoEvent[]>("/upcoming", {
        current_time: new Date().toISOString(),
    });
};
