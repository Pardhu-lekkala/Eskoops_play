import React, { useState, useEffect } from "react";
import { Grid, Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import editpencil from "../../static/images/editpencil.png";
import Badge from "@material-ui/core/Badge";
import { history } from "../../routers/history";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardActionArea from "@material-ui/core/CardActionArea";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import auth from "../../services/auth";
import Webcam from "react-webcam";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import PhotoIcon from "@material-ui/icons/Photo";
import VideocamIcon from "@material-ui/icons/Videocam";

const useStyles = makeStyles((theme) => ({
  WallOfFameroot: {
    [theme.breakpoints.down("md")]: {
      margin: "0px 6px",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: 720,
      margin: "auto", //maxHeight: 464, //marginLeft: "32%", //marginTop: "30px",
    },
  },
  rightSideContainer: {
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
  edit: {
    textAlign: "center",
    borderRadius: "50%",
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

const WallOfFame = (props) => {
  const classes = useStyles({});
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("first_name"));
  const [image, setImage] = useState(localStorage.getItem("image"));
  const [Uimage, setUImage] = useState(localStorage.getItem("image"));
  const [error, setError] = useState(false);
  const [registerData, setRegisterdata] = useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const webcamRef = React.useRef(null);
  const [errorText, setErrorText] = useState("");
  const [showNow, setShowNow] = React.useState("profile");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleOpenEdit = () => {
    setOpenEdit(true);
    setShowNow("editprofile");
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

    if (userName) {
      if (image) {
        // setShowLoader(false)
        let registerRes;
        if (image === localStorage.getItem("image")) {
          registerRes = await auth.editProfile({
            name: userName,
            image: image,
          });
        } else {
          registerRes = await auth.editProfile({
            name: userName,
            file: Uimage,
            image: image,
          });
        }

        if (registerRes.status == "true") {
          setShowNow("profile");
          setError(false);
          props.setRefresh(!props.refresh);
        } else {
          setErrorText(registerRes.message);
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

  return (
    <Grid container>
      {showNow === "profile" ? (
        <>
          <Grid item sm={3}></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{ paddingTop: "120px", margin: "auto" }}
          >
            <Card style={{ height: "160px" }}>
              <Grid container alignItems="center" style={{ height: "100%" }}>
                <Grid item xs={4} style={{ paddingLeft: "20px" }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={localStorage.getItem("image")}
                    style={{
                      width: "96px",
                      height: "96px",
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ fontWeight: "bold" }}
                  >
                    {localStorage.getItem("first_name")}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    {JSON.parse(localStorage.getItem("userProfile")).email}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      fontSize: "14px",
                      color: "#FE7300",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={handleOpenEdit}
                  >
                    Edit
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      fontSize: "14px",
                      color: "#FE7300",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={handleClickOpen}
                  >
                    Logout
                  </Typography>
                </Grid>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to log out?"}
                  </DialogTitle>
                  {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent> */}
                  <DialogActions>
                    <Button onClick={() => logout()} color="primary" autoFocus>
                      Yes
                    </Button>
                    <Button onClick={handleClose} color="primary">
                      No
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Card>
          </Grid>
          <Grid item sm={3}></Grid>
        </>
      ) : (
        ""
      )}

      {showNow === "editprofile" ? (
        <Grid
          item
          container
          sm={7}
          alignItems="center"
          justify="center"
          style={{ paddingTop: "120px", margin: "auto" }}
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
              Edit your profile
            </Typography>
            <Typography style={{ fontSize: "18px", textAlign: "center" }}>
              <label for="file-input">
                {openCamera ? (
                  ""
                ) : (
                  <>
                    {matches ? (
                      <img
                        src={image}
                        className={classes.edit}
                        alt="edit"
                        style={{
                          width: "220px",
                          height: "220px",
                          borderRadius:
                            image !== localStorage.getItem("image")
                              ? "50%"
                              : "",
                        }}

                        // onClick={() => history.push('/')}
                      />
                    ) : (
                      <img
                        src={image}
                        className={classes.edit}
                        alt="edit"
                        style={{
                          width: "220px",
                          height: "220px",
                          borderRadius:
                            image !== localStorage.getItem("image")
                              ? "50%"
                              : "",
                        }}
                        // onClick={() => history.push('/')}
                        onClick={() => handleClickOpen()}
                      />
                    )}
                    {matches ? (
                      <Badge
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <img
                            src={editpencil}
                            style={{
                              marginLeft: "-65px",
                              width: "30px",
                              marginTop: "-35px",
                            }}
                            alt="badge"
                          />
                        }
                      ></Badge>
                    ) : (
                      <Badge
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <img
                            src={editpencil}
                            style={{
                              marginLeft: "-65px",
                              width: "30px",
                              marginTop: "-35px",
                            }}
                            onClick={() => handleClickOpen()}
                            alt="badge"
                          />
                        }
                      ></Badge>
                    )}
                  </>
                )}
              </label>
              {matches ? (
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
              ) : (
                ""
              )}
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
              defaultValue={localStorage.getItem("first_name")}
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
      ) : (
        ""
      )}
    </Grid>
  );
};

export default WallOfFame;
