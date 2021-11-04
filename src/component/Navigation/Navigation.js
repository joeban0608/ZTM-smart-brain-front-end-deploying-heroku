import React from "react";

const Navigation = ({ onRouteChange, isSignedIn }) => {

    if (isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p 
                    onClick={() => onRouteChange('signout')} 
                    className="link dim f3 black underline pa3 pointer">Sign Out
                </p>
            </nav>
        )
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p 
                    onClick={() => onRouteChange('signin')} 
                    className="link dim f3 black underline pa3 pointer">Sign in
                </p>
                <p 
                    onClick={() => onRouteChange('register')} 
                    className="link dim f3 black underline pa3 pointer">Register
                </p>
            </nav>
        )
    }
}

export default Navigation;