import React, { useEffect } from "react";
import {
  BrowserRouter,
  Switch,
  Redirect,
  Route,
  Router,
} from "react-router-dom";
import { history } from "./history";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AccessCodeNew from "../pages/accessCode/AccessCodeNew";
import EmailAddressNew from "../pages/emailAddress/EmailAddressNew";
import Password from "../pages/accessCode/Password";
import AuthPassword from "../pages/emailAddress/Password";
import SetProfileNew from "../pages/setProfile/SetProfileNew";
import Challenges from "../pages/challenges/ChallengesHome";

const WiseskoopRouter = () => {
  // useEffect(()=>{
  //     let token = localStorage.getItem('token');

  //     if(!token){

  //         history.push('/home?show=login')
  //     }
  //   },[])

  return (
    <>
      {/* {
          !status.online?(
             <p style={{
          position:"absolute",
          left:0,
          right:0,
          top:0,
          padding:"2px",
          backgroundColor:"#b31919",
          color:"white",
          zIndex:10000,
          textAlign:"center"
        }}>You're offline, please connect to internet to continue</p>   
          ):null
        } */}

      <Router forceRefresh={true} history={history}>
        <Switch>
          <PublicRoute component={AccessCodeNew} path="/" exact />
          {/* <AccessCodeNew component={AccessCodeNew} path='/' exact/> */}
          <PublicRoute component={Password} path="/password" exact />
          <PublicRoute component={AuthPassword} path="/auth-password" exact />
          <PublicRoute component={EmailAddressNew} path="/e-mail" exact />
          <PublicRoute component={SetProfileNew} path="/set-profile" exact />
          {/* {localStorage.getItem("token") ?  */}
          <PrivateRoute component={Challenges} path="/challenges" exact /> :
          {/* ''
            } */}
          {/* <PublicRoute component={Page404}/> */}
        </Switch>
      </Router>
    </>
  );
};

export default WiseskoopRouter;
