import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
//import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
//import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import auth from "../../services/auth";
import Webcam from "react-webcam";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import PhotoIcon from "@material-ui/icons/Photo";
import VideocamIcon from "@material-ui/icons/Videocam";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 24,
    height: 24,
    border: `2px solid ${theme.palette.background.paper}`,
    cursor: "pointer",
  },
}))(Avatar);

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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

/* const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions); */

export default function CustomizedDialogs({
  popUpTeamOpen,
  setPopUpTeamOpen,
  getLeaderboard,
}) {
  const classes = useStyles();
  const [userName, setUserName] = useState(popUpTeamOpen.data.team_name);
  const [error, setError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [image, setImage] = useState("");
  const [Uimage, setUImage] = useState("");
  const [showNow, setShowNow] = React.useState("profile");
  const [errorText, setErrorText] = useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const webcamRef = React.useRef(null);

  const handleSubmit = async (team_id) => {
    setShowLoader(true);
    //console.log("userName",userName)
    if (userName!=="") {
      if (userName!=="") {
        // setShowLoader(false)
  
        let registerRes;
        if (!image) {
          registerRes = await auth.updateTeamDetails({
            name: userName ? userName : popUpTeamOpen.data.team_name,
            image: image,
            team_id: team_id,
          });
        } else {
          registerRes = await auth.updateTeamDetails({
            name: userName ? userName : popUpTeamOpen.data.team_name,
            file: Uimage,
            image: image,
            team_id: team_id,
          });
        }

        if (registerRes.status === "true") {
          setShowNow("profile");
          setError(false);
          setPopUpTeamOpen({ ...popUpTeamOpen, open: false });
          setShowEditName(false);
          setShowEditImage(false);
          getLeaderboard();
          setImage("")
          setUImage("")
        } else {
          setErrorText(registerRes.message);
          setError(true);
          setOpenAlert(true);
          setImage("")
          setUImage("")
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
 

  const handleClickOpen = () => {
    setOpen(true);
    setShowEditImage(true);
  };

  const handleClosePopup = () => {
    setOpen(false);
    /* setImage("");
    setUImage("");
    setOpenAlert(false);
    setOpenCamera(false);
    setShowEditName(false);
    setShowEditImage(false); */
  };

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setUImage(blob);
    setOpenCamera(false);
  }, [webcamRef, setImage]);

  const handleClose = () => {
    setPopUpTeamOpen({ ...popUpTeamOpen, open: false });
    setImage("")
    setUImage("")
    setShowEditName(false)
    setShowEditImage(false)

  };

  return (
    <>
      {popUpTeamOpen.data?.team_members && (
        <div>
          <SimpleDialog
            open={open}
            onClose={handleClosePopup}
            setOpenCamera={setOpenCamera}
            setOpen={setOpen}
            setImage={setImage}
            setUImage={setUImage}
          />
          <Dialog
            onClose={handleClose}
            open={popUpTeamOpen.open}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle onClose={handleClose}>Team Details</DialogTitle>

            <DialogContent dividers>
              <div style={{ width: "100%" }}>
                <Grid style={{ width: "100%" }} container alignItems="center">
                  <Grid item xs={6} md={3}>
                    {openCamera ? (
                      <Grid xs={12}>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          style={{ width: "85%" }}
                          mirrored
                        />
                        <Grid xs={12}>
                          <button onClick={capture}>Capture photo</button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Badge
                        overlap="circle"
                        
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <>
                            {popUpTeamOpen.canEdit && (
                              <SmallAvatar onClick={() => handleClickOpen()}>
                                <EditIcon
                                  style={{ height: "20px", width: "20px" }}
                                />
                              </SmallAvatar>
                            )}
                          </>
                        }
                      >
                        <Avatar
                          style={{
                            width: "96px",
                            height: "96px",
                          }}
                          src={image ? image : popUpTeamOpen.data.team_image}
                        />
                      </Badge>
                    )}
                  </Grid>
                  <Grid item xs={6} md={9} container>
                    {showEditName || showEditImage ? (
                      <Grid>
                        {popUpTeamOpen.canEdit && (
                          <Grid>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              autoComplete="off"
                              style={{ width: "100%" }}
                              defaultValue={popUpTeamOpen.data.team_name}
                              onChange={(e) => {
                                setUserName(e.target.value.trim());
                                setError(false);
                              }}
                              helperText={error ? "Please enter team name" : ""}
                              error={error}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit(popUpTeamOpen.data.team_id);
                                }
                              }}
                            />
                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              style={{ borderRadius: "8px" }}
                              onClick={() =>
                                handleSubmit(popUpTeamOpen.data.team_id)
                              }
                            >
                              <Typography
                                style={{
                                  textTransform: "capitalize",
                                  backgroundColor: "#FE7300",
                                }}
                              >
                                Save{" "}
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
                        )}
                      </Grid>
                    ) : (
                      <Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            paddingBottom: "4px",
                            fontSize: "24px",
                            fontWeight: "600",
                          }}
                        >
                          {popUpTeamOpen.data.team_name}
                        </Grid>
                        {popUpTeamOpen.canEdit && (
                          <Grid
                            item
                            xs={12}
                            style={{ color: "#FE7300", cursor: "pointer" }}
                            onClick={() => setShowEditName(true)}
                          >
                            Edit Name
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </div>
            </DialogContent>

            <DialogContent dividers>
              <div
                style={{
                  width: "100%",
                  color: "#8391A7",
                  paddingBottom: "18px",
                  fontWeight: "600",
                }}
              >
                TEAM MEMBERS
              </div>
              <div style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  {popUpTeamOpen.data.team_members.map((member) => (
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={2} md={1}>
                          <Avatar
                            alt="Remy Sharp"
                            style={{
                              width: "30px",
                              height: "30px",
                            }}
                            src={member.user_image}
                          />
                        </Grid>
                        <Grid item xs={10} ms={11}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              height: "100%",
                            }}
                          >
                            <Typography style={{ fontSize: "16px" }}>
                              {member.user_name}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </DialogContent>
            {/* <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions> */}
          </Dialog>
        </div>
      )}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(1),
    // width: '100%',
    background: "#FE7300",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#FE7300",
    },
  },
}));