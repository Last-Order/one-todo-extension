import request from "~utils/request";

export enum OrderStatus {
    Created = 0,
    Finished = 1,
    Cancelled = 2,
    Timeout = 3,
}

interface OrderEntity {
    id: string;
    status: OrderStatus;
}

export const checkOrderStatus = async (internalOrderId: string) => {
    return await request.get<OrderEntity>("/order/check_order_status", {
        internal_order_id: internalOrderId,
    });
};
