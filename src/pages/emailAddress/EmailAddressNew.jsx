import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import logo from "../../static/images/logo.png";
import { history } from "../../routers/history";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import auth from "../../services/auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Thought_Bulb_image from "../../static/images/Thought_Bulb_image.png";
import login_bg1 from "../../static/images/login_bg1.png";
import { useQuery } from '../../utils/helpers'

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    height: "100vh",
    background: "white",
  },
  bigText: {
    fontSize: "32px",
    lineHeight: "44px",
    fontWeight: "700",
    //  [theme.breakpoints.down('xs')]: {
    //      textAlign: "center"
    //    },
  },
  smallText: {
    fontSize: "16px",
    lineHeight: "24px",
    //  [theme.breakpoints.down('xs')]: {
    //      textAlign: "center"
    //    },
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%",
    borderRadius: "8px",
    background: "#FE7300",
    "&:hover": {
      backgroundColor: "#FE7300",
    },
    circularLoader: {
      height: "30px",
      width: "30px",
      color: "white",
    },
  },
  rightSideContainer: {
    backgroundImage: `url(${login_bg1})`,
    height: "100%",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center left",
    "&::before": {
      //border: "2px solid red",
      position: "absolute",
      content: '""',
      width: "33%",
      height: "100%",
      right: "0px",
      background: "#E0E7EA",
    },
  },
  logoSmall: {
    [theme.breakpoints.down("xs")]: {
      width: "122px",
      height: "88px",
    },
  },
}));

const EmailAddress = (props) => {
  const query = useQuery();

  const classes = useStyles({});
  const [emailAddress, setEmailAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [gameImage, setGameImage] = useState('');

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const queryParameterCheckAndOperations = useCallback(async () => {
    console.log(query.get('accessCode'))
    if (!props.location.accessCode) {
      if (query.get('accessCode') === '' || query.get('accessCode') === null) {
        history.replace('/', { fromEmail: true });
      } else {
        localStorage.clear();
        setAccessCode(query.get('accessCode'));
        let res = await auth.accessCode(query.get('accessCode'));
        if (res.status) {
          localStorage.setItem('start_date', res.data.start_date);
          localStorage.setItem('end_date', res.data.end_date);
          setGameImage(localStorage.getItem('game_image') ? localStorage.getItem('game_image') : "");
          if (res.data.access_password) {
            history.push({
              pathname: "/password",
              accessCode: query.get('accessCode'),
            });
          }
        } else {
          if (res.accessCode !== 429) {
            history.replace('/', { fromEmail: true });
          }
        }
      }
    } else {
      let res = await auth.accessCode(props.location.accessCode);
      if (res.status) {
        localStorage.setItem('start_date', res.data.start_date);
        localStorage.setItem('end_date', res.data.end_date);
        setGameImage(localStorage.getItem('game_image') ? localStorage.getItem('game_image') : "");
        if (res.data.access_password) {
          history.push({
            pathname: "/password",
            accessCode: query.get('accessCode'),
          });
        }
      } else {
        if (res.accessCode !== 429) {
          history.replace('/', { fromEmail: true });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (props.location.accessCode) {
      setAccessCode(props.location.accessCode);
    }
    queryParameterCheckAndOperations();
  }, [props.location.accessCode, queryParameterCheckAndOperations]);

  const validateEmail = (emailField) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(emailField) == false) {
      // alert('Invalid Email Address');
      return false;
    }

    return true;
  };

  const featureFlag = true;

  const handleSubmit = async () => {
    setShowLoader(true);
    if (emailAddress) {
      if (validateEmail(emailAddress)) {
        // setShowLoader(false)

        let loginRes = await auth.login({
          email: emailAddress.toString(),
          password: "12345678".toString(),
        });
        const registeredUser = loginRes.status;
        if (loginRes.status) {
          setShowLoader(false);
          localStorage.setItem("e-mail", emailAddress);
          history.push({
            pathname: "/challenges",
            accessCode: accessCode,
            emailAddress: emailAddress,
            registeredUser: registeredUser,
          });
        } else if (
          loginRes.data.message === "Unavailable User" &&
          featureFlag
        ) {
          setShowLoader(false);
          localStorage.setItem("e-mail", emailAddress);
          history.push({
            pathname: "/set-profile",
            accessCode: accessCode,
            emailAddress: emailAddress,
            registeredUser: registeredUser,
          });
        } else if (
          loginRes.data.message === "Unauthorized User" &&
          featureFlag
        ) {
          setShowLoader(false);
          localStorage.setItem("e-mail", emailAddress);
          history.push({
            pathname: "/auth-password",
            accessCode: accessCode,
            emailAddress: emailAddress,
            registeredUser: registeredUser,
          });
        } else if (!featureFlag) {
          setShowLoader(false);
          localStorage.setItem("e-mail", emailAddress);
          history.push({
            pathname: "/set-profile",
            accessCode: accessCode,
            emailAddress: emailAddress,
            registeredUser: registeredUser,
          });
        }
      } else {
        setShowLoader(false);
        setError(true);
        setErrorText("Please enter a valid Email");
      }
    } else {
      setShowLoader(false);
      setError(true);
      setErrorText("Please enter an Email Address");
    }
  };

  return matches ? (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.rootContainer}
    >
      <Grid
        justify="center"
        alignItems="center"
        container
        spacing={5}
        style={{ height: matches ? "75%" : "" }}
      >
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          sm={5}
          className={classes.logoContainer}
        >
          <Grid item>
            <img
              src={
                gameImage
                  ? gameImage
                  : Thought_Bulb_image
              }
              //height="48"
              //width="66"
              height="96"
              width="132"
              className={classes.logoSmall}
              alt="logo"
              onClick={() => history.push("/")}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          sm={7}
          className={matches ? "" : classes.rightSideContainer}
          alignItems="center"
          justify="center"
        >
          <Grid
            item
            style={{
              width: matches ? "" : "55%",
              padding: matches ? "0px 20px" : "",
              zIndex: 1,
            }}
          >
            <Typography className={classes.bigText}>
              Enter Email Address
            </Typography>
            <Typography className={classes.smallText}>
              Enter your registered email ID or use a new one to start afresh!
            </Typography>
            <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
              Email address
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              style={{ width: "100%" }}
              onChange={(e) => {
                setEmailAddress(e.target.value.trim());
                setError(false);
                setErrorText("");
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              error={error}
              helperText={errorText}
            />
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => handleSubmit()}
            >
              <Typography style={{ textTransform: "capitalize" }}>
                Continue{" "}
              </Typography>
              {showLoader ? (
                <Typography>
                  {/* {" "} */}
                  <CircularProgress
                    className={classes.circularLoader}
                    style={{
                      width: "16px",
                      height: "16px",
                      marginLeft: "20px",
                      color: "white",
                    }}
                  />
                  {/* {" "} */}
                </Typography>
              ) : (
                ""
              )}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.rootContainer}
    >
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        sm={5}
        className={classes.logoContainer}
      >
        <Grid item>
          <img
            src={
              gameImage
                ? gameImage
                : Thought_Bulb_image
            }
            //height="48"
            //width="66"
            height="152"
            width="210"
            className={classes.logoSmall}
            alt="logo"
            onClick={() => history.push("/")}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        sm={7}
        className={matches ? "" : classes.rightSideContainer}
        alignItems="center"
        justify="center"
      >
        <Grid
          item
          style={{
            width: matches ? "" : "55%",
            padding: matches ? "0px 20px" : "",
            zIndex: 1,
          }}
        >
          <Typography className={classes.bigText}>
            Enter Email Address
          </Typography>
          <Typography className={classes.smallText}>
            Enter your registered email ID or use a new one to start afresh!
          </Typography>
          <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
            Email address
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            autoComplete="off"
            style={{ width: "100%" }}
            onChange={(e) => {
              setEmailAddress(e.target.value.trim());
              setError(false);
              setErrorText("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            error={error}
            helperText={errorText}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => handleSubmit()}
          >
            <Typography style={{ textTransform: "capitalize" }}>
              Continue{" "}
            </Typography>
            {showLoader ? (
              <Typography>
                {/* {" "} */}
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                    color: "white",
                  }}
                />
                {/* {" "} */}
              </Typography>
            ) : (
              ""
            )}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmailAddress;
