import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "../../custom-elements";
import { RootState } from "../../store/store";
import UserMenu from "./UserMenu";

function Navbar() {
    const { isLoggedIn } = useSelector((state: RootState) => state.userReducer);
    const history = useHistory();
    function handleLoginClick() {
        history.push("/login");
    }
    function handleSignupClick() {
        history.push("/signup");
    }
    function handleLogoClick() {
        if (isLoggedIn === true) {
            history.push("/dashboard");
        } else if (isLoggedIn === false) {
            history.push("/");
        }
    }
    return (
        <div className="flex fixed h-4 justify-between w-full px-5 pt-3">
            <div onClick={handleLogoClick} className="text-xl cursor-pointer">
                Hear Together
            </div>
            {isLoggedIn === true && (
                <div className="flex">
                    <UserMenu></UserMenu>
                </div>
            )}
            {isLoggedIn === false && (
                <div>
                    <button onClick={handleLoginClick} className="mr-4 text-teal-300 focus:outline-none hover:text-teal-200">
                        Log In
                    </button>
                    <Button onClick={handleSignupClick}>Sign Up</Button>
                </div>
            )}
        </div>
    );
}

export default Navbar;
