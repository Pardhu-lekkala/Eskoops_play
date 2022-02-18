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
import { Carousel } from "react-responsive-carousel";

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    minHeight: "100vh",
    background: "#002146",
  },
  logo: {
    height: "4.5rem",
    width: "11.75rem",
    // paddingRight: '0.5rem',
    cursor: "pointer",
    marginTop: "64px",
    marginLeft: "15%",
  },
  logoMobile: {
    marginLeft: "20px",
    marginTop: "4px",
    marginBottom: "4px",
  },
  textTop: {
    fontSize: "24px",
    color: "#FFFFFF",
    marginLeft: "15%",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
    },
  },
  imageContainer: {
    paddingBottom: "65%",
    width: "65%",
    background: "#8391A7",
    borderRadius: "8px",
  },
  imageAndTitle: {
    marginLeft: "28%",
  },
  circularLoader: {
    height: "30px",
    width: "30px",
    color: "white",
  },
  title: {
    fontSize: "24px",
    color: "#FFFFFF",
    textAlign: "center",
    margin: "16px",
    width: "60%",
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%",
    background: "#FE7300",
    "&:hover": {
      backgroundColor: "#FE7300",
    },
  },
}));

const AccessCode = () => {
  const classes = useStyles({});
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async () => {
    setShowLoader(true);
    if (accessCode) {
      localStorage.clear();
      let res = await auth.accessCode(accessCode);
      setShowLoader(false);
      if (res.status) {
        history.push({
          pathname: "/e-mail",
          accessCode: accessCode,
        });
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

  useEffect(() => {
    document.getElementsByClassName("control-dots")[0].style.bottom = "-14px";
    document.getElementsByClassName("control-dots")[0].style.right = "-18px";
  }, []);

  return (
    <div>
      {!matches ? (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid container item sm={4} className={classes.leftContainer}>
            <Grid item>
              <Typography
                variant="h3"
                color="inherit"
                noWrap
                className={classes.toolbarTitle}
              >
                <img
                  src={logo}
                  className={classes.logo}
                  alt="logo"
                  onClick={() => history.push("/")}
                />
              </Typography>
              <Typography className={classes.textTop}>
                Create self run exciting team engagement activities with SKOOP.
              </Typography>
            </Grid>
            <Carousel showStatus={false} autoPlay={true} infiniteLoop={true}>
              <Grid item className={classes.imageAndTitle}>
                <Grid item>
                  <div className={classes.imageContainer}></div>
                </Grid>
                <Typography className={classes.title}>Title</Typography>
                <Typography
                  style={{
                    fontSize: "16px",
                    color: "#FFFFFF",
                    width: "80%",
                    marginBottom: "20px",
                    marginLeft: "-23px",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Grid>
              <Grid item className={classes.imageAndTitle}>
                <Grid item>
                  <div className={classes.imageContainer}></div>
                </Grid>
                <Typography className={classes.title}>Title</Typography>
                <Typography
                  style={{
                    fontSize: "16px",
                    color: "#FFFFFF",
                    width: "80%",
                    marginBottom: "20px",
                    marginLeft: "-23px",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Grid>
              <Grid item className={classes.imageAndTitle}>
                <Grid item>
                  <div className={classes.imageContainer}></div>
                </Grid>
                <Typography className={classes.title}>Title</Typography>
                <Typography
                  style={{
                    fontSize: "16px",
                    color: "#FFFFFF",
                    width: "80%",
                    marginBottom: "20px",
                    marginLeft: "-23px",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Grid>
            </Carousel>
          </Grid>
          <Grid
            item
            sm={8}
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item sm={3}></Grid>
            <Grid item sm={6}>
              <Typography style={{ fontSize: "32px" }}>Access Code</Typography>
              <Typography style={{ fontSize: "18px", width: "95%" }}>
                Enter the access code provided by the moderator to enter the
                game or course
              </Typography>
              <Typography style={{ fontSize: "14px", marginTop: "24px" }}>
                Enter access code
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                autoComplete="off"
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
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => handleSubmit()}
              >
                <Typography>Proceed </Typography>
                <Typography>
                  <CircularProgress
                    className={classes.circularLoader}
                    style={{
                      display: showLoader ? "block" : "none",
                      width: "16px",
                      height: "16px",
                      marginLeft: "20px",
                    }}
                  />
                </Typography>
              </Button>
            </Grid>
            <Grid item sm={3}></Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="column" justify="center">
          <Grid container item direction="column" style={{ display: "unset" }}>
            <Grid
              item
              xs={4}
              style={{ background: "#002146", maxWidth: "100%" }}
            >
              <Typography
                variant="h3"
                color="inherit"
                noWrap
                className={classes.toolbarTitle}
              >
                <img
                  src={logo}
                  className={classes.logoMobile}
                  alt="logo"
                  onClick={() => history.push("/")}
                />
              </Typography>
            </Grid>
            <Grid item style={{ marginTop: "40px", marginLeft: "20px" }}>
              <Typography style={{ fontSize: "32px", lineHeight: "44px" }}>
                Access Code
              </Typography>
              <Typography style={{ fontSize: "18px", marginRight: "15px" }}>
                Enter the access code provided by the moderator to enter the
                game or course
              </Typography>
              <Typography style={{ fontSize: "14px", marginTop: "24px" }}>
                Enter access code
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                autoComplete="off"
                style={{ width: "95%" }}
                helperText={error ? "Please enter Access code" : ""}
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
                variant="contained"
                color="secondary"
                style={{ width: "95%" }}
                className={classes.button}
                onClick={() => handleSubmit()}
              >
                Proceed
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AccessCode;
