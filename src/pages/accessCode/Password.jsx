import React, { useState, useEffect } from "react";
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

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    height: "100vh",
    background: "white",
  },
  bigText: {
    fontSize: "32px",
    lineHeight: "44px",
    fontWeight: "700",
  },
  smallText: {
    fontSize: "16px",
    lineHeight: "24px",
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
  logoSmall: {
    [theme.breakpoints.down("xs")]: {
      width: "122px",
      height: "88px",
    },
  },
  rightSideContainer: {
    backgroundImage: `url(${login_bg1})`,
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center left",
    "&::before": {
      position: "absolute",
      content: '""',
      width: "33%",
      height: "100%",
      right: "0px",
      background: "#E0E7EA",
    },
  },
}));

const AccessCode = (props) => {
  const classes = useStyles({});
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    if (props.location.accessCode) {
      setAccessCode(props.location.accessCode);
    }
  }, []);

  const handleSubmit = async () => {
    setShowLoader(true);
    if (password) {
      let game_id = localStorage.getItem("game_id");
      let res = await auth.password(accessCode, game_id, password);
      setShowLoader(false);
      if (res.status) {
        if (res.data.access_password) {
          history.push({
            pathname: "/e-mail",
            accessCode: accessCode,
          });
        } else {
          // history.push({
          //     pathname: '/e-mail',
          //     accessCode: accessCode,
          //   })
          setError(true);
          setErrorText("Please re-check your Password");
        }

        setError(false);
        setShowLoader(false);
      } else {
        if (res.accessCode !== 429) {
          setError(true);
          setErrorText("Please re-check your Password");
        }
        setShowLoader(false);
      }
    } else {
      setError(true);
      setErrorText("Please enter Password");
      setShowLoader(false);
    }
  };
  // useEffect(() => {
  //   document.getElementsByClassName("control-dots")[0].style.bottom = '-14px';
  //   document.getElementsByClassName("control-dots")[0].style.right = '-18px';

  // }, []);
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
              //src={Thought_Bulb_image}
              src={
                localStorage.getItem("game_image")
                  ? localStorage.getItem("game_image")
                  : Thought_Bulb_image
              }
              //height="48"
              //width="66"
              height="96"
              width="132"
              //   className={classes.logo}
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
            alignItems="center"
          >
            <Typography className={classes.bigText}>Password</Typography>
            <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
              Enter password for access code
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              style={{ width: "100%" }}
              helperText={errorText}
              error={error}
              onChange={(e) => {
                setPassword(e.target.value.trim());
                setError(false);
                setErrorText("");
              }}
              onKeyPress={async (e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
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
            //src={Thought_Bulb_image}
            src={
              localStorage.getItem("game_image")
                ? localStorage.getItem("game_image")
                : Thought_Bulb_image
            }
            //height="48"
            //width="66"
            height="96"
            width="132"
            //   className={classes.logo}
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
          alignItems="center"
        >
          <Typography className={classes.bigText}>Password</Typography>
          <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
            Enter password for access code
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            autoComplete="off"
            style={{ width: "100%" }}
            helperText={errorText}
            error={error}
            onChange={(e) => {
              setPassword(e.target.value.trim());
              setError(false);
              setErrorText("");
            }}
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
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

export default AccessCode;
