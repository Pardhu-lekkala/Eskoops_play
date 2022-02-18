import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, Grid } from "@material-ui/core";
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
    // [theme.breakpoints.down('xs')]: {
    //     textAlign: "center"
    //   },
  },
  smallText: {
    fontSize: "16px",
    lineHeight: "24px",
    // [theme.breakpoints.down('xs')]: {
    //     textAlign: "center"
    //   },
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%",
    background: "#FE7300",
    borderRadius: "8px",
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
  logoSmall: {
    [theme.breakpoints.down("xs")]: {
      width: "122px",
      height: "88px",
    },
  },
}));

const AccessCode = ({ location }) => {
  const classes = useStyles({});
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const [showAccessCodeError, setShowAccessCodeError] = useState(false);
  const [showTimeExpired, setShowTimeExpired] = useState(false);

  useEffect(() => {
    if (location.state?.fromEmail) {
      setShowAccessCodeError(true);
    }
    if (location.state?.fromChallenges) {
      setShowTimeExpired(true);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    setShowLoader(true);
    if (accessCode) {
      localStorage.clear();
      let res = await auth.accessCode(accessCode);
      setShowLoader(false);
      if (res.status) {
        localStorage.setItem("start_date", res.data.start_date);
        localStorage.setItem("end_date", res.data.end_date);
        if (res.data.access_password) {
          history.push({
            pathname: "/password",
            accessCode: accessCode,
          });
        } else {
          history.push({
            pathname: "/e-mail",
            accessCode: accessCode,
          });
        }

        setError(false);
        setShowLoader(false);
      } else {
        if (res.accessCode !== 429) {
          setError(true);
          setErrorText("Please re-check your Access code");
        }
        setShowLoader(false);
      }
    } else {
      setError(true);
      setErrorText("Please enter Access code");
      setShowLoader(false);
    }
  };
  // useEffect(() => {
  //   document.getElementsByClassName("control-dots")[0].style.bottom = '-14px';
  //   document.getElementsByClassName("control-dots")[0].style.right = '-18px';

  // }, []);
  return (
    <React.Fragment>
      {matches ? (
        <Grid
          container
          justify='center'
          alignItems='center'
          className={classes.rootContainer}
        >
          <Grid
            justify='center'
            alignItems='center'
            container
            spacing={5}
            style={{ height: matches ? "75%" : "" }}
          >
            <Grid
              item
              container
              justify='center'
              alignItems='center'
              sm={5}
              className={classes.logoContainer}
            >
              <Grid item>
                <img
                  src={Thought_Bulb_image}
                  className={classes.logoSmall}
                  //   className={classes.logo}
                  alt='logo'
                  onClick={() => history.push("/")}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              sm={7}
              className={matches ? "" : classes.rightSideContainer}
              alignItems='center'
              justify='center'
            >
              <Grid
                style={{ width: "100%", height: "100%", zIndex: 1 }}
                container
                justify='center'
                alignItems='center'
              >
                <Grid
                  item
                  style={{
                    width: matches ? "" : "55%",
                    padding: matches ? "0px 20px" : "",
                  }}
                >
                  <Typography className={classes.bigText}>
                    Access Code
                  </Typography>
                  <Typography className={classes.smallText}>
                    Let’s get you started.
                  </Typography>
                  <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
                    {/* Enter access code */}
                    Enter the code
                  </Typography>
                  <TextField
                    id='outlined-basic'
                    variant='outlined'
                    autoComplete='off'
                    style={{ width: "100%" }}
                    helperText={errorText}
                    error={error}
                    onChange={(e) => {
                      setAccessCode(e.target.value.trim());
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
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    onClick={() => handleSubmit()}
                  >
                    <Typography style={{ textTransform: "capitalize" }}>
                      Proceed{" "}
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
        </Grid>
      ) : (
        <Grid
          container
          justify='center'
          alignItems='center'
          className={classes.rootContainer}
        >
          <Grid
            item
            container
            justify='center'
            alignItems='center'
            sm={5}
            className={classes.logoContainer}
          >
            <Grid item>
              <img
                src={Thought_Bulb_image}
                className={classes.logoSmall}
                //   className={classes.logo}
                alt='logo'
                onClick={() => history.push("/")}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            sm={7}
            className={matches ? "" : classes.rightSideContainer}
            alignItems='center'
            justify='center'
          >
            <Grid
              style={{ width: "100%", height: "100%", zIndex: 1 }}
              container
              justify='center'
              alignItems='center'
            >
              <Grid
                item
                style={{
                  width: matches ? "" : "55%",
                  padding: matches ? "0px 20px" : "",
                }}
              >
                <Typography className={classes.bigText}>Access Code</Typography>
                <Typography className={classes.smallText}>
                  Let’s get you started.
                </Typography>
                <Typography style={{ fontSize: "14px", paddingTop: "24px" }}>
                  {/*  Enter access code */}
                  Enter the code
                </Typography>
                <TextField
                  id='outlined-basic'
                  variant='outlined'
                  autoComplete='off'
                  style={{ width: "100%" }}
                  helperText={errorText}
                  error={error}
                  onChange={(e) => {
                    setAccessCode(e.target.value.trim());
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
                  variant='contained'
                  color='secondary'
                  className={classes.button}
                  onClick={() => handleSubmit()}
                >
                  <Typography style={{ textTransform: "capitalize" }}>
                    Proceed{" "}
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
      )}
      <Dialog
        open={showAccessCodeError}
        onClose={() => setShowAccessCodeError(false)}
      >
        <DialogTitle id='alert-dialog-title'>
          Access code is invalid or expired!
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowAccessCodeError(false)} color='primary'>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showTimeExpired} onClose={() => setShowTimeExpired(false)}>
        <DialogTitle id='alert-dialog-title'>Your game time is up!</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowTimeExpired(false)} color='primary'>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AccessCode;
