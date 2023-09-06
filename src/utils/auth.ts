import { Storage } from "@plasmohq/storage";

const storage = new Storage({
    copiedKeyList: ["jwt_token"],
});

class Auth {
    /**
     * 是否已经登录
     */
    async isLogin(): Promise<boolean> {
        return !!(await storage.get("jwt_token"));
    }

    async getToken(): Promise<string> {
        return await storage.get("jwt_token");
    }

    /**
     * 登录
     */
    async login(token: number): Promise<void> {
        await storage.set("jwt_token", token);
    }
    /**
     * 登出
     */
    async logout(): Promise<void> {
        await storage.remove("jwt_token");
    }
}

export default new Auth();
