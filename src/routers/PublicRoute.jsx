import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../services/auth";

const PublicRoute = ({ component: Component, ...rest }) => { 
  return (
    <Route
      {...rest}
      render={props => {


            // if(props.location.pathname==="/e-mail" && !localStorage.getItem("game_id")){
            //     return <Redirect to="/" />;
            // }
            // else 
            if(props.location.pathname==="/set-profile"){

                if(localStorage.getItem("game_id") && localStorage.getItem("e-mail") && !localStorage.getItem("token")){
                return <Component {...props} />
                }else{
                return <Redirect to="/" />;
                }
            }
           else{
            return <Component {...props} />;
           } 
      }}
    />
  );
};
export default PublicRoute;