import type { SubscriptionType } from "~popup/constants";
import request from "~utils/request";
import dayjs from "dayjs";
import type { TodoEvent, TodoStatus } from "./types";

export const getUpcomingEvents = async () => {
    return await request.get<TodoEvent[]>("/event/upcoming", {
        current_time: dayjs().format(),
    });
};

export const updateEventStatus = async (eventId: number, status: TodoStatus) => {
    return await request.post("/event/update_status", {
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
    return await request.post<PrepareCreateEventResult>("/event/prepare_create", {
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
    return await request.post<TodoEvent>("/event/create", {
        event_name: eventName,
        description,
        scheduled_time: scheduledTime,
        remind_time: remindTime,
    });
};

export interface UpdateEventPayload extends CreateEventPayload {
    id: number;
}

export const updateEvent = async (params: UpdateEventPayload) => {
    const { id, eventName, scheduledTime, remindTime, description } = params;
    return await request.post<TodoEvent>("/event/update", {
        id,
        event_name: eventName,
        description,
        scheduled_time: scheduledTime,
        remind_time: remindTime,
    });
};

export interface DeleteEventPayload {
    id: number;
}

export const deleteEvent = async (params: DeleteEventPayload) => {
    const { id } = params;
    return await request.post<TodoEvent>("/event/delete", {
        id,
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
        subscription_type: SubscriptionType;
    };
}

export const getUserProfile = async () => {
    return await request.get<UserProfileResponse>("/user/profile", {});
};

export interface CreateOrderParams {
    redirect_url: string;
}

export interface CreateOrderResponse {
    checkout_url: string;
}

export const createOrder = async (params: CreateOrderParams) => {
    const { redirect_url } = params;
    return await request.post<CreateOrderResponse>("/order/checkout", {
        redirect_url,
    });
};
