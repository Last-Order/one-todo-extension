import auth from "./auth";

export class RequestError extends Error {
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}

class Request {
    baseUrl: string;

    constructor() {
        this.baseUrl = process.env.PLASMO_PUBLIC_API_BASE;
    }

    request<T>(
        method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
        path: string = "/",
        payload: Record<string, string> = {},
    ): Promise<T> {
        console.log(`[${new Date().toISOString()}] ${method} ${path}`);

        let url = `${this.baseUrl}${path}`;

        const options: RequestInit = {
            method: method,
            mode: "cors",
        };
        if (method === "GET" && Object.keys(payload).length > 0) {
            url += `?${new URLSearchParams(payload).toString()}`;
        }
        if (method === "POST") {
            options.headers = {
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(payload);
        }
        return new Promise(async (resolve, reject) => {
            if (await auth.isLogin()) {
                options.headers = {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${await auth.getToken()}`,
                };
            }
            try {
                const response = await fetch(url, options);
                if (response?.ok) {
                    resolve((await response.json()) as T);
                } else {
                    reject(await this.parseErrorResponse(response));
                }
            } catch (e) {
                reject(new RequestError("network_error", `${e.status} ${e.statusText}`));
            }
        });
    }

    /**
     * HTTP GET
     * @param path
     * @param payload
     */
    get<T>(path: string = "/", payload: Record<string, any>) {
        return this.request<T>("GET", path, payload);
    }
    /**
     * HTTP POST
     * @param path
     * @param payload
     */
    post<T>(path: string = "/", payload: Record<string, any>) {
        return this.request<T>("POST", path, payload);
    }

    async parseErrorResponse(e: Response): Promise<RequestError> {
        try {
            const errorBody = await e.json();
            if (errorBody.code === "need_login") {
                // 登录失效
                auth.logout();
                return;
            }
            if (errorBody.code && errorBody.message) {
                return new RequestError(errorBody.code, errorBody.message);
            } else {
                return new RequestError("unknown_error", "Please try again");
            }
        } catch (e) {
            return new RequestError("unknown_error_parsing", "Please try again");
        }
    }
}

export default new Request();
