import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import user from "../../static/images/user.jpg";
// import edit from "../../static/images/edit.png";
import edit from "../../static/images/select_profile_picture.png";
import { history } from "../../routers/history";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import auth from "../../services/auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Thought_Bulb_image from "../../static/images/Thought_Bulb_image.png";
import login_bg1 from "../../static/images/login_bg1.png";
import Webcam from "react-webcam";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import PhotoIcon from "@material-ui/icons/Photo";
import VideocamIcon from "@material-ui/icons/Videocam";
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import emoji1 from '../../static/emojis/1.jpg'
import emoji2 from '../../static/emojis/2.jpg'
import emoji3 from '../../static/emojis/3.jpg'
import emoji4 from '../../static/emojis/4.jpg'
import emoji5 from '../../static/emojis/5.jpg'
import emoji6 from '../../static/emojis/6.jpg'
import emoji7 from '../../static/emojis/7.jpg'
import emoji8 from '../../static/emojis/8.jpg'
import emoji9 from '../../static/emojis/9.jpg'
import emoji10 from '../../static/emojis/10.jpg'
import emoji11 from '../../static/emojis/11.jpg'
import emoji12 from '../../static/emojis/12.jpg'
import emoji13 from '../../static/emojis/13.jpg'
import emoji14 from '../../static/emojis/14.jpg'
import emoji15 from '../../static/emojis/15.jpg'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const WebcamComponent = () => <Webcam />;

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    height: "100vh",
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
    background: "#FE7300",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#FE7300",
    },
  },

  circularLoader: {
    height: "30px",
    width: "30px",
    color: "white",
  },
  edit: {
    textAlign: "center",
  },
  rootContainer: {
    height: "100vh",
    background: "white",
  },
  bigText: {
    fontSize: "32px",
    lineHeight: "44px",
    fontWeight: "700",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  smallText: {
    fontSize: "16px",
    lineHeight: "24px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%",
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
  // rightSideContainer : {
  //     background: `url(${Thought_Bulb_image})`
  // }
}));

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [isDisabled, setisDisabled] = React.useState(true);

  const handleClose = () => {
    onClose(selectedValue);
    setisDisabled(true);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const photoCamera = () => {
    props.setOpenCamera(true);
    props.setOpen(false);
  };

  const selectFromGallery = () => {
    setisDisabled(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Select upload type</DialogTitle>
      <List>
        <label for="file-input">
          <ListItem button onClick={() => selectFromGallery()}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PhotoIcon color="action" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Gallery"} />
          </ListItem>
        </label>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          disabled={isDisabled}
          onChange={(e) => {
            props.setImage(URL.createObjectURL(e.target.files[0]));
            props.setUImage(e.target.files[0]);
            props.setOpen(false);
            setisDisabled(true);
          }}
          hidden
        />
        <ListItem button onClick={() => photoCamera()}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <VideocamIcon color="action" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={"Camera"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

const Profile = (props) => {
  const classes = useStyles({});
  const [emailAddress, setEmailAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState(edit);
  const [Uimage, setUImage] = useState('');
  const [error, setError] = useState(false);
  const [registerData, setRegisterdata] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const webcamRef = React.useRef(null);
  const [errorText, setErrorText] = useState("");
  const [open, setOpen] = React.useState(false);

  const [gameImage, setGameImage] = useState('');

  useEffect(() => {
    setGameImage(localStorage.getItem('game_image'))
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    setAccessCode(localStorage.getItem("access_code"));
    setEmailAddress(localStorage.getItem("e-mail"));

    // (async () => {
    //   console.log(Uimage);
    //   let response = await fetch(Uimage); // local file path
    //   let data = await response.blob();
    //   setUImage(data);
    // })();
  }, []);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const photoCamera = () => {
    setOpenCamera(true);
  };

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setUImage(blob);
    setOpenCamera(false);
  }, [webcamRef, setImage]);

  const handleSubmit = async () => {
    setShowLoader(true);

    let imageToProvide = Uimage;

    if (Uimage === '') {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      let url = '';
      switch (randomNumber) {
        case 1: { url = emoji1; break; }
        case 2: { url = emoji2; break; }
        case 3: { url = emoji3; break; }
        case 4: { url = emoji4; break; }
        case 5: { url = emoji5; break; }
        case 6: { url = emoji6; break; }
        case 7: { url = emoji7; break; }
        case 8: { url = emoji8; break; }
        case 9: { url = emoji9; break; }
        case 10: { url = emoji10; break; }
        case 11: { url = emoji11; break; }
        case 12: { url = emoji12; break; }
        case 13: { url = emoji13; break; }
        case 14: { url = emoji14; break; }
        case 15: { url = emoji15; break; }
      }
      imageToProvide = await fetch(url).then((res) => res.blob()).then(blob => new File([blob], 'Profile.jpg'));
      console.log('image to provide', imageToProvide)
    }

    if (userName) {
      if (true) {
        //image !== edit
        // setShowLoader(false)

        let registerRes = await auth.register({
          first_name: userName,
          email: emailAddress,
          file: imageToProvide,
          password: 12345678,
          password_confirmation: 12345678,
          register_type: "register",
        });
        if (registerRes.status == "true") {
          history.push("/challenges");
          setError(false);
        } else {
          console.log(registerRes);
          setErrorText(registerRes?.errors?.message);
          setError(true);
          setOpenAlert(true);
        }
      } else {
        setError(true);
        setOpenAlert(true);
      }
      setError(false);
      setShowLoader(false);
    } else {
      setError(true);
      setShowLoader(false);
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
              style={{ height: 152, width: 210 }}
              src={gameImage ? gameImage : Thought_Bulb_image}
              className={classes.logoSmall}
              alt="logo"
              onClick={() => history.push("/")}
            />
          </Grid>
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleAlertClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Alert onClose={handleAlertClose} severity="error">
              {/* {errorText ? errorText : "Please upload a profile picture"} */}
              {errorText ? errorText : "Registration failed. Try Again Later."}
            </Alert>
          </Snackbar>
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
            <Typography style={{ fontSize: "32px", textAlign: "center" }}>
              Set your profile
            </Typography>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              <label for="file-input">
                {openCamera ? (
                  ""
                ) : (
                  <img
                    src={image}
                    className={classes.edit}
                    alt="edit"
                    style={{
                      width: "100px",
                      height: "100px",
                      pointer: "cursor",
                      borderRadius: image !== edit ? "50%" : "",
                    }}

                  // onClick={() => history.push('/')}
                  // onClick={()=>handleClickOpen()}
                  />
                )}
              </label>

              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={(e) => {
                  setImage(URL.createObjectURL(e.target.files[0]));
                  setUImage(e.target.files[0]);
                }}
                hidden
              />
              {openCamera ? (
                <Grid xs={12}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: "45%" }}
                    mirrored
                  />
                  <Grid xs={12}>
                    <button onClick={capture}>Capture photo</button>
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
              {/* {openCamera  ? "" : <CameraAltIcon color="action" onClick={() => photoCamera()} />} */}
            </Typography>
            <Typography style={{ fontSize: "14px", marginTop: "24px" }}>
            Name/Team Number.
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              style={{ width: "100%" }}
              onChange={(e) => {
                setUserName(e.target.value.trim());
                setError(false);
              }}
              helperText={error ? "Please enter your name" : ""}
              error={error}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{ borderRadius: "8px" }}
              onClick={() => handleSubmit()}
            >
              <Typography style={{ textTransform: "capitalize" }}>
                Continue{" "}
              </Typography>
              {showLoader ? (
                <Typography>
                  {" "}
                  <CircularProgress
                    className={classes.circularLoader}
                    style={{
                      width: "16px",
                      height: "16px",
                      marginLeft: "20px",
                      color: "white",
                    }}
                  />{" "}
                </Typography>
              ) : (
                ""
              )}
            </Button>
          </Grid>
        </Grid>
        <SimpleDialog
          open={open}
          onClose={handleClose}
          setOpenCamera={setOpenCamera}
          setOpen={setOpen}
          setImage={setImage}
          setUImage={setUImage}
        />
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
            style={{ height: 152, width: 210 }}
            src={gameImage ? gameImage : Thought_Bulb_image}
            className={classes.logoSmall}
            alt="logo"
            onClick={() => history.push("/")}
          />
        </Grid>
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Alert onClose={handleAlertClose} severity="error">
            {/* {errorText ? errorText : "Please upload a profile picture"} */}
            {errorText ? errorText : "Registration failed. Try Again Later."}
          </Alert>
        </Snackbar>
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
          <Typography style={{ fontSize: "32px", textAlign: "center" }}>
            Set your profile
          </Typography>
          <Typography style={{ fontSize: "18px", textAlign: "center" }}>
            <label for="file-input">
              {openCamera ? (
                ""
              ) : (
                <img
                  src={image}
                  className={classes.edit}
                  alt="edit"
                  style={{
                    width: "220px",
                    height: "220px",
                    pointer: "cursor",
                    borderRadius: image !== edit ? "50%" : "",
                  }}
                  // onClick={() => history.push('/')}
                  onClick={() => handleClickOpen()}
                />
              )}
            </label>

            {/* <input
     type="file"
     id="file-input"
     accept="image/*"
     onChange={ (e)=>{
       setImage(URL.createObjectURL(e.target.files[0]))
       setUImage(e.target.files[0])
     }}
       
     hidden
   /> */}
            {openCamera ? (
              <Grid xs={12}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: "45%" }}
                  mirrored
                />
                <Grid xs={12}>
                  <button onClick={capture}>Capture photo</button>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {/* {openCamera  ? "" : <CameraAltIcon color="action" onClick={() => photoCamera()} />} */}
          </Typography>
          <Typography style={{ fontSize: "14px", marginTop: "24px" }}>
          Name/Team Number
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            autoComplete="off"
            style={{ width: "100%" }}
            onChange={(e) => {
              setUserName(e.target.value.trim());
              setError(false);
            }}
            helperText={error ? "Please enter your name" : ""}
            error={error}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            style={{ borderRadius: "8px" }}
            onClick={() => handleSubmit()}
          >
            <Typography style={{ textTransform: "capitalize" }}>
              Continue{" "}
            </Typography>
            {showLoader ? (
              <Typography>
                {" "}
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                    color: "white",
                  }}
                />{" "}
              </Typography>
            ) : (
              ""
            )}
          </Button>
        </Grid>
        <SimpleDialog
          open={open}
          onClose={handleClose}
          setOpenCamera={setOpenCamera}
          setOpen={setOpen}
          setImage={setImage}
          setUImage={setUImage}
        />
      </Grid>
    </Grid>
  );
};

export default Profile;
