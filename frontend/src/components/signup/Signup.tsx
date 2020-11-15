import Axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, FormError, Input } from "../../custom-elements";
import { IUser } from "../../models/user/IUser";
import UserService from "../../services/UserService";
import { RootState } from "../../store/store";
import { setCurrentUser, setIsLoggedIn } from "../../store/user-slice";

interface Error {
    username: string;
    password: string;
    confirmPassword: string;
}
function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState({} as Error);
    const dispatch = useDispatch();
    const history = useHistory();
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const valid = validateForm();
        if (valid) {
            UserService.signup({
                username: username,
                password: password,
            })
                .then((response) => {
                    Axios.defaults.headers.common = {
                        user_token: response.data.token,
                    };
                    localStorage.setItem("user_token", response.data.token);
                    dispatch(setCurrentUser(response.data));
                    dispatch(setIsLoggedIn(true));
                    history.push("/dashboard");
                })
                .catch((error) => {
                    setFormError({
                        confirmPassword: "",
                        password: "",
                        username: error.response?.data,
                    });
                });
        }
    }

    function validateForm() {
        const newFormError = {} as Error;
        if (!username) {
            newFormError.username = "Please enter a username";
        }
        if (!password) {
            newFormError.password = "Please enter a password";
        }
        if (confirmPassword !== password) {
            newFormError.confirmPassword = "Passwords do not match";
        }

        setFormError(newFormError);
        if (Object.keys(newFormError).length) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center flex-col mx-auto max-w-md">
                <div className="text-4xl pb-2">Create a new account</div>
                <div className="w-full py-2">
                    <Input
                        value={username}
                        error={Boolean(formError.username)}
                        onInput={(value) => setUsername(value.currentTarget.value)}
                        placeholder="Username"
                    ></Input>
                    <FormError>{formError.username}</FormError>
                </div>
                <div className="w-full py-2">
                    <Input
                        value={password}
                        onInput={(value) => setPassword(value.currentTarget.value)}
                        type="password"
                        placeholder="Password"
                        error={Boolean(formError.password)}
                    ></Input>
                    <FormError>{formError.password}</FormError>
                </div>
                <div className="w-full py-2">
                    <Input
                        value={confirmPassword}
                        onInput={(value) => setConfirmPassword(value.currentTarget.value)}
                        error={Boolean(formError.confirmPassword)}
                        type="password"
                        placeholder="Confirm Password"
                    ></Input>
                    <FormError>{formError.confirmPassword}</FormError>
                </div>
                <div></div>
                <div className="w-full pt-2">
                    <Button type="submit" className="w-full text-lg">
                        Create Account
                    </Button>
                </div>
                <div className="pt-2">
                    <Link className="underline" to="/login">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default Signup;
