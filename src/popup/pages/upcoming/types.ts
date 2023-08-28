export interface TodoEvent {
    id: number;
    event_name: string;
    description: string;
    scheduled_time: string;
    remind_time: string;
    status: TodoStatus;
}

export enum TodoStatus {
    CREATED = 0,
    DONE = 1,
    DELETED = 2,
}
