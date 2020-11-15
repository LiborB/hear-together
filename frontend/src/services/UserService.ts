import Axios from "axios";
import ICreateUser from "../models/user/ICreateUser";
import ILoginUser from "../models/user/ILoginUser";
import { IUser } from "../models/user/IUser";

export default class UserService {
    private static readonly baseUrl = "user";
    static signup(createUser: ICreateUser) {
        return Axios.post<IUser>(`${this.baseUrl}/create`, createUser);
    }

    static login(loginUser: ILoginUser) {
        return Axios.post<IUser>(`${this.baseUrl}/login`, loginUser);
    }

    static logout() {
        return Axios.post<void>(`${this.baseUrl}/logout`);
    }

    static auth(token: string) {
        return Axios.post<IUser>(`${this.baseUrl}/auth`, null, {
            headers: {
                user_token: token,
            },
        })
    }
}