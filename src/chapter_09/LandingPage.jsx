import React, {useState} from "react";
import Toolbar from "./Toolbar";

function LandingPage(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const onClickLogin = () => {
        setIsLoggedIn(true);
    };

    const onCLickLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div>
            <Toolbar
            isLoggedIn={isLoggedIn}
            onClickLogin={onClickLogin}
            onCLickLogout={onCLickLogout}
            />
            <div style={{padding: 16}}>리액트 공부!</div>
        </div>
    );
}

export default LandingPage;