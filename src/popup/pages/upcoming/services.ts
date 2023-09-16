import request from "~utils/request";
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

export interface PrepareCreateEventResult {
    event_name: string;
    scheduled_time: string;
    description?: string;
}

export const prepareCreateEvent = async (description: string) => {
    return await request.post<PrepareCreateEventResult>("/prepare_create_event", {
        current_time: dayjs().format(),
        description,
    });
};

export interface CreateEventPayload {
    eventName: string;
    scheduledTime: string;
    remindTime: string;
    description: string;
}

export const createEvent = async (params: CreateEventPayload) => {
    const { eventName, scheduledTime, remindTime, description } = params;
    return await request.post<TodoEvent>("/create_event", {
        event_name: eventName,
        description,
        scheduled_time: scheduledTime,
        remind_time: remindTime,
    });
};

export interface UserProfileResponse {
    first_name: string;
    last_name: string;
    avatar: string;
    quota_info: {
        quota: number;
        used_count: number;
    };
    subscription: {
        start_time: string;
        end_time: string;
        subscription_name: string;
        subscription_type: number;
    };
}

export const getUserProfile = async () => {
    return await request.get<UserProfileResponse>("/user/profile", {});
};
