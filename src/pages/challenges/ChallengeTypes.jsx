//import { streamToBlob } from "stream-to-blob";
import React, { useState } from "react";
import randomBytes from "randombytes";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Delete from "../../static/images/Delete.png";
import video_cover from "../../static/images/video_cover.jpg";
import file_upload from "../../static/images/file_upload.png";
import loading_gif from "../../static/images/loading_gif.gif";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import auth from "../../services/auth";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Webcam from "react-webcam";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import PhotoIcon from "@material-ui/icons/Photo";
import VideocamIcon from "@material-ui/icons/Videocam";
import FormHelperText from "@material-ui/core/FormHelperText";
import InfoIcon from "@material-ui/icons/Info";

import MatchTheFollowing from "./matchthefollowing";
import LeftList from "./matchthefollowing/LeftList";

import Bowser from "bowser";
import is from "is_js";

/* function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
} */

const useStyles = makeStyles((theme) => ({
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

//const WebcamComponent = () => <Webcam />;

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  /* const handleListItemClick = (value) => {
    onClose(value);
  }; */

  const photoCamera = () => {
    props.setOpenCamera(true);
    props.setOpenVideoCamera(false);
    props.setOpen(false);
  };

  const videoCamera = () => {
    props.setOpenVideoCamera(true);
    props.setOpenCamera(false);
    props.setOpen(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Select upload type</DialogTitle>
      <List>
        <ListItem button onClick={() => photoCamera()}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <PhotoIcon color="action" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={"Photo"} />
        </ListItem>
        <ListItem button onClick={() => videoCamera()}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <VideocamIcon color="action" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={"Video"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

const ChallengeTypes = (props) => {
  const classes = useStyles({});
  const [value, setValue] = React.useState(null);
  const [radioValue, setRadioValue] = React.useState(null);
  const [checkedValues, setCheckedvalues] = React.useState([]);
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  //const [showLoader, setShowLoader] = useState(false);
  // const [openCamera, setOpenCamera] = useState(false);
  // const [openVideoCamera, setOpenVideoCamera] = useState(false);
  const webcamRef = React.useRef(null);
  const [imageLoader, setImageLoader] = React.useState(false);
  //const [blob, setblob] = React.useState(null);
  const [errorText, setErrorText] = useState("");
  const [errorRadio, setErrorRadio] = useState("");
  const [errorCheckbox, setErrorCheckbox] = useState("");

  const [mLeft, setMLeft] = useState([]);
  const [mRight, setMRight] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [isIos, setIsIos] = React.useState(is.ios());

  const { popUpOpen, setPopUpOpen, popUpMTFOpen, setPopUpMTFOpen } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgData(imageSrc);
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setPicture(blob);

    /* const file = new File([blob], `${randomBytes(16).toString("hex")}`, {
      type: blob.type,
    });

    console.log(blob);
    console.log(file);
    setPicture(file); */

    props.setOpenCamera(false);
    props.setOpenVideoCamera(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamRef, setImgData]);

  const mediaRecorderRef = React.useRef(null);

  const { setCapturing, capturing } = props;
  const { setRecordedChunks, recordedChunks } = props;

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);

    //MediaRecorder.isTypeSupported("video/x-matroska;codecs=avc1,opus")
    //MediaRecorder.isTypeSupported("video/mp4;codecs:h264")

    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserEngine = browser.getEngineName(true);
    const browserName = browser.getBrowserName(true);

    /*     //console.clear();
    console.log(window.navigator.userAgent);
    console.log(browserEngine);
    console.log(browserName);
    console.log(is.safari());

    alert(
      `${browserEngine}:::${browserName}:::${
        browserName === "safari" || browserEngine === "webkit"
      }`
    ); */

    const options =
      browserName === "safari" || browserEngine === "webkit"
        ? {}
        : { mimeType: "video/webm;codecs=vp8,opus" };

    mediaRecorderRef.current = new MediaRecorder(
      webcamRef.current.stream,
      options
    );

    //mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream);
    //? { mimeType: "video/mp4" }

    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    mediaRecorderRef.current.start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        /* var blob = new Blob([].concat(data), { type: "video/mp4" });
        console.log(blob); */

        setImgData(video_cover);

        /* setRecordedChunks((prev) => prev.concat(blob));

        setPicture(blob); */

        setRecordedChunks((prev) => prev.concat(data));

        /* const file = new File([data], `${randomBytes(16).toString("hex")}`, {
          type: data.type,
        });

        console.log(file);
        setPicture(file); */

        setPicture(data);
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();

    /* const blob = new Blob(recordedChunks, {
      type: "video/webm",
    }); */

    /* setTimeout(function () {
      console.log(blob);
      console.log(recordedChunks.length);
    }, 3000); */

    /* setImgData(video_cover);
    setPicture(blob); */

    props.setOpenVideoCamera(false);

    setCapturing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  /*   const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      setPicture(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedChunks]); */

  const onChangePicture = (e) => {
    setImgData(loading_gif);
    //console.log("eee", e.target.type);
    if (e.target.files[0]) {
      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (e.target.files[0].type.includes("video")) {
          setImgData(video_cover);
        } else {
          setImgData(reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
      props.setOpenCamera(false);
      props.setOpenVideoCamera(false);
    }
  };

  const handleChange = async (event, challenge_id, game_id) => {
    setRadioValue(parseInt(event.target.value));
    setErrorRadio(false);
  };

  const handleChangeText = async (event, challenge_id, game_id) => {
    setValue(event.target.value.trim());
    setErrorText(false);
  };

  /* const hideCamera = () => {
    props.openVideoCamera(false);
    props.openCamera(false);
  }; */

  const handleChangeCheckbox = async (event, challenge_id, game_id) => {
    if (!event.target.checked) {
      let checkedValuesCopy = checkedValues;
      const checkedValuesnew = checkedValuesCopy.filter(function (name) {
        return name !== event.target.name;
      });
      setCheckedvalues(checkedValuesnew);
    } else {
      setCheckedvalues([...checkedValues, event.target.name]);

      setErrorCheckbox(false);
    }
    setValue(parseInt(checkedValues));
  };

  //SUBMIT ANSWER
  const submitAnswer = async (challenge_id, game_id) => {
    setImageLoader(true);
    if (value) {
      let res = await auth.submitAnswer(
        value,
        challenge_id,
        game_id,
        props.panels[props.i]
      );
      if (res.data !== undefined) {
        props.handlePanel(props.panels[props.i]);
        let newArr = [...props.challengesStatus];
        newArr[props.i] = "1";
        props.setChallengesStatus(newArr);
        props.setSuccessOpenAlert(true);
        props.setExpanded(false);
        setValue(null);
        setImageLoader(false);
        if (res.correct_type === "1" && res.correct_content) {
          setPopUpOpen({
            open: true,
            data: res.correct_content,
          });
          ////console.clear();
          //console.log("insideif");
        } else if (res.correct_type === "0" && res.in_correct_content) {
          setPopUpOpen({
            open: true,
            data: res.in_correct_content,
          });
          ////console.clear();
          //console.log("elseif");
        }
        //console.log("popUpOpen", popUpOpen, res);

        // await setchallengesData(res.array)
      } else {
        // setOpenAlert(true)
        setImageLoader(false);
      }
    } else {
      setErrorText(true);
      setImageLoader(false);
    }
  };

  //SUBMIT ANSWER
  const submitRadioAnswer = async (challenge_id, game_id) => {
    setImageLoader(true);
    if (radioValue) {
      let res = await auth.submitAnswer(
        radioValue,
        challenge_id,
        game_id,
        props.panels[props.i]
      );
      if (res.data !== undefined) {
        setImageLoader(false);
        props.handlePanel(props.panels[props.i]);
        let newArr = [...props.challengesStatus];
        newArr[props.i] = "1";
        props.setChallengesStatus(newArr);
        props.setSuccessOpenAlert(true);
        props.setExpanded(false);
        setRadioValue(null);
        if (res.correct_type === "1" && res.correct_content) {
          setPopUpOpen({
            open: true,
            data: res.correct_content,
          });
          //console.clear();
          //console.log("insideif");
        } else if (res.correct_type === "0" && res.in_correct_content) {
          setPopUpOpen({
            open: true,
            data: res.in_correct_content,
          });
          //console.clear();
          //console.log("elseif");
        }
        //console.log("popUpOpen", popUpOpen, res);

        // await setchallengesData(res.array)
      } else {
        // setOpenAlert(true)
        setImageLoader(false);
      }
    } else {
      setErrorRadio(true);
      setImageLoader(false);
    }
  };

  //SUBMIT ANSWER
  const submitImage = async (challenge_id, game_id) => {
    setImageLoader(true);
    console.log(picture);
    let res = await auth.submitImageAnswer(picture, challenge_id, game_id);
    if (res.status === "true") {
      let newArr = [...props.challengesStatus];
      newArr[props.i] = "1";
      props.setChallengesStatus(newArr);
      props.setExpanded(false);
      setImageLoader(false);
      props.setSuccessOpenAlert(true);
      // await setchallengesData(res.array)
      if (res.correct_type === "1" && res.correct_content) {
        setPopUpOpen({
          open: true,
          data: res.correct_content,
        });
        //console.clear();
        //console.log("insideif");
      } else if (res.correct_type === "0" && res.in_correct_content) {
        setPopUpOpen({
          open: true,
          data: res.in_correct_content,
        });
        //console.clear();
        //console.log("elseif");
      }
      //console.log("popUpOpen", popUpOpen, res);
    } else {
      // setOpenAlert(true)
      props.setOpenAlert(true);
      // setShowLoader(false)
      setImageLoader(false);
    }
  };

  //SUBMIT ANSWER
  const submitCheckedAnswer = async (challenge_id, game_id) => {
    setImageLoader(true);

    if (checkedValues.length !== 0) {
      let res = await auth.submitAnswer(
        checkedValues.toString(),
        challenge_id,
        game_id
      );
      if (res.data !== undefined) {
        if (res.correct_type === "1" && res.correct_content) {
          setPopUpOpen({
            open: true,
            data: res.correct_content,
          });
          //console.clear();
          //console.log("insideif");
        } else if (res.correct_type === "0" && res.in_correct_content) {
          setPopUpOpen({
            open: true,
            data: res.in_correct_content,
          });
          //console.clear();
          //console.log("elseif");
        }
        //console.log("popUpOpen", popUpOpen, res);

        let newArr = [...props.challengesStatus];
        newArr[props.i] = "1";
        props.setChallengesStatus(newArr);
        props.setSuccessOpenAlert(true);
        props.setExpanded(false);
        setCheckedvalues(null);
        setImageLoader(false);

        // await setchallengesData(res.array)
      } else {
        // setOpenAlert(true)
        setImageLoader(false);
      }
    } else {
      setErrorCheckbox(true);
      setImageLoader(false);
    }
  };

  //SUBMIT ANSWER
  const handleMatchTheFollowingSubmit = async (challenge_id, game_id, data) => {
    setImageLoader(true);

    let res = await auth.submitAnswer(data, challenge_id, game_id);

    if (res.data !== undefined) {
      if (res.correct_type === "1" && res.correct_content) {
        setPopUpOpen({
          open: true,
          data: res.correct_content,
        });
      } else if (res.correct_type === "0" && res.in_correct_content) {
        setPopUpOpen({
          open: true,
          data: res.in_correct_content,
        });
      }

      let newArr = [...props.challengesStatus];
      newArr[props.i] = "1";
      props.setChallengesStatus(newArr);
      props.setSuccessOpenAlert(true);
      props.setExpanded(false);

      setMRight([]);
      setMLeft([]);

      setImageLoader(false);

      // await setchallengesData(res.array)
    } else {
      // setOpenAlert(true)
      setImageLoader(false);
    }
  };
  const colors=["#4081C3","#64D0C8","#9376CB","#E68C64","#D25C9E","#CE5754"]
  const deleteImage = () => {
    setImgData(null);
    setPicture(null);
    setRecordedChunks([]);
  };

  if (
    props.item.challange_type === "text" ||
    props.item.challange_type === "fill_in_the_blanks"
  ) {
    return (
      <div style={{ marginLeft: "15%", width: "100%" }}>
        {/* <Typography>{props.item.challenge_detail.split('<p>')[1].split('</p>')[0]}</Typography> */}
        {/* <div dangerouslySetInnerHTML={{__html: props.item.challenge_detail}}></div> */}
        <TextField
          id="outlined-basic"
          variant="outlined"
          autoComplete="off"
          style={{ width: "80%" }}
          multiline
          rows={4}
          rowsMax={8}
          helperText={errorText ? "Please enter some text" : ""}
          error={errorText}
          onChange={(event) =>
            handleChangeText(event, props.item.challenge_id, props.item.game_id)
          }
        />
        <Grid container spacing={2}>
          <Grid item>
            {" "}
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              // style={{width:'25%'}}
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              // onClick = { ()=>handleSubmit() }
              disabled={props.challengesStatus[props.i] === "1" ? true : ""}
              onClick={() => {
                submitAnswer(
                  props.item.challenge_id,
                  props.item.game_id,
                  props.panels[props.i]
                );
              }}
            >
              Submit
              <Typography>
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    display: imageLoader ? "block" : "none",
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                  }}
                />
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                // width:'25%',
                // marginLeft:'-309px',
                backgroundColor: "#FFFFFF",
                color: "#3C4858",
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              onClick={props.handlePanel(props.panels[props.i])}
              //onClick={props.handlePanel(props.panels[props.i])}
              // onClick = { ()=>handleSubmit() }
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else if (props.item.challange_type === "radio") {
    return (
      <div style={{ marginLeft: "1%", width: "100%",display:"flex",flexDirection:"row",justifyContent:"center", flexWrap:"wrap",width:"100%"}}>
        {/* <Typography>{props.item.challenge_detail.split('<p>')[1].split('</p>')[0]}</Typography> */}
        {/* <div dangerouslySetInnerHTML={{__html: props.item.challenge_detail}}></div> */}
        <FormControl component="fieldset" error={errorRadio}>
          {/* <FormLabel component="legend">Gender</FormLabel> */}
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={radioValue}
            onChange={(event) =>
              handleChange(event, props.item.challenge_id, props.item.game_id)
            }
          >
            
            <div style={{display:"flex",flexDirection:"row",justifyContent:"center", flexWrap:"wrap",width:"100%"}}>
            { props.item.challange_option ?
            props.item.challange_option.map((item,index) => {
            console.log(props.item.challange_option,"this is item")
            console.log(index,"this is index")
              return ( 
                <div
                 style={{
                backgroundColor:colors[index],
                //backgroundColor:"grey",
                 borderRadius:"30px",
                 marginBottom:"10px",
                 width:"520px",
                 margin:"10px",
                 border:"3px solid silver",
                 paddingLeft:"10px",
                 opacity: 0.8,
                 color:"black"}}>
                <FormControlLabel
                  value={parseInt(item.option_id)}
                  control={<Radio />}
                  label={item.option_content}
                />
                </div> 
              );
            }) : ""


          }
          </div>
          
          </RadioGroup>
          <FormHelperText>
            {errorRadio ? "Please select an option" : ""}
          </FormHelperText>
        </FormControl>
        <Grid container spacing={2} style={{display:"flex",justifyContent:"center"}}>
          <Grid item>
            {" "}
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              // style={{width:'25%'}}
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              // onClick = { ()=>handleSubmit() }
              disabled={props.challengesStatus[props.i] === "1" ? true : ""}
              onClick={() => {
                // props.setSuccessOpenAlert(true);
                submitRadioAnswer(props.item.challenge_id, props.item.game_id);
                // props.setExpanded(false);
              }}
            >
              Submit
              <Typography>
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    display: imageLoader ? "block" : "none",
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                  }}
                />
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                // width:'25%',
                // marginLeft:'-309px',
                backgroundColor: "#FFFFFF",
                color: "#3C4858",
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              onClick={props.handlePanel(props.panels[props.i])}
              // onClick = { ()=>handleSubmit() }
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else if (props.item.challange_type === "checkbox") {
    return (
      <div style={{ marginLeft: "15%", width: "100%" }}>
        {/* <Typography>{props.item.challenge_detail.split('<p>')[1].split('</p>')[0]}</Typography> */}
        {/* <div dangerouslySetInnerHTML={{__html: props.item.challenge_detail}}></div> */}
        <FormControl
          component="fieldset"
          className={classes.formControl}
          error={errorCheckbox}
        >
          {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
          <FormGroup>
          <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",width:"800px"}}>
            {props.item.challange_option.map((item,index) => {
              return (
                <div
                 style={{
                backgroundColor:colors[index],
                 borderRadius:"30px",
                 marginBottom:"10px",
                 width:"330px",
                 margin:"10px",
                 border:"3px solid silver",
                 paddingLeft:"10px",
                 opacity: 0.8,
                 color:"black"}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(event) =>
                        handleChangeCheckbox(
                          event,
                          props.item.challenge_id,
                          props.item.game_id
                        )
                      }
                      name={item.option_id}
                    />
                  }
                  label={item.option_content}
                />
                </div>
              );
            })}
            </div>
          </FormGroup>
          <FormHelperText>
            {errorCheckbox ? "Please select atleast one option" : ""}
          </FormHelperText>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item>
            {" "}
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              // style={{width:'25%'}}
              // onClick = { ()=>handleSubmit() }
              disabled={props.challengesStatus[props.i] === "1" ? true : ""}
              onClick={() => {
                submitCheckedAnswer(
                  props.item.challenge_id,
                  props.item.game_id
                );
              }}
            >
              Submit
              <Typography>
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    display: imageLoader ? "block" : "none",
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                  }}
                />
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                // width:'25%',
                // marginLeft:'-309px',
                backgroundColor: "#FFFFFF",
                color: "#3C4858",
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              onClick={props.handlePanel(props.panels[props.i])}
              // onClick = { ()=>handleSubmit() }
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else if (props.item.challange_type === "matching") {
    return (
      <div
        style={{
          //marginLeft: "15%",
          width: "100%",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <div
              style={{
                marginLeft: "7px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <InfoIcon
                style={{ color: "#FE7300", cursor: "pointer" }}
                onClick={() => setPopUpMTFOpen({ open: true, data: null })}
              />
              <span
                style={{
                  color: "#FE7300",
                  marginLeft: "5px",
                }}
              >
                You can drag and drop options below
              </span>
            </div>
          </Grid>
          <Grid item xs={6} style={{ zIndex: 65 }}>
            <LeftList
              options={props.item.challange_option}
              setMLeft={setMLeft}
            />
          </Grid>
          <Grid item xs={6} style={{ zIndex: 65 }}>
            <MatchTheFollowing
              options={props.item.challange_option}
              setMRight={setMRight}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
                width: "25%",
              }}
              //style={{width:'25%'}}
              onClick={() => {
                console.log(mLeft, mRight);
                const data = [];
                for (let i = 0; i < mLeft.length; ++i) {
                  data.push(`${mLeft[i].option_id},${mRight[i].option_id}`);
                }
                handleMatchTheFollowingSubmit(
                  props.item.challenge_id,
                  props.item.game_id,
                  data
                );
              }}
            >
              Submit
              <Typography>
                <CircularProgress
                  className={classes.circularLoader}
                  style={{
                    display: imageLoader ? "block" : "none",
                    width: "16px",
                    height: "16px",
                    marginLeft: "20px",
                  }}
                />
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return (
      <div style={{ marginLeft: "15%", width: "100%" }}>
        {/* <Typography>{props.item.challenge_detail.split('<p>')[1].split('</p>')[0]}</Typography> */}
        {/* <div dangerouslySetInnerHTML={{__html: props.item.challenge_detail}}></div> */}

        {imgData ? (
          <div>
            <img
              className="playerProfilePic_home_tile"
              src={imgData}
              alt=""
              style={{ width: "150px", height: "106px" }}
            />
            {imageLoader ? (
              <CircularProgress
                style={{ marginLeft: "-95px", marginBottom: "30px" }}
              />
            ) : (
              ""
            )}

            <img
              className="playerProfilePic_home_tile"
              src={Delete}
              alt=""
              onClick={() => deleteImage()}
              style={{
                width: "24px",
                height: "24px",
                marginBottom: "92px",
                marginLeft: imageLoader ? "40px" : "-13px",
                cursor: "pointer",
              }}
            />
          </div>
        ) : (
          ""
        )}

        <Grid container direction="row">
          <Grid item spacing={2} style={{ padding: "6px" }}>
            {imgData ? (
              <Button
                variant="contained"
                component="label"
                className={classes.button}
                style={
                  props.challengesStatus[props.i] === "1"
                    ? {
                        color: "rgba(0, 0, 0, 0.26)",
                        boxShadow: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                        marginTop: "10px",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }
                    : {
                        background: "#FE7300",
                        color: "white",
                        marginTop: "10px",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }
                }
                disabled={props.challengesStatus[props.i] === "1" ? true : ""}
                onClick={() => {
                  submitImage(props.item.challenge_id, props.item.game_id);
                }}
              >
                Submit
                <Typography>
                  <CircularProgress
                    className={classes.circularLoader}
                    style={{
                      display: imageLoader ? "block" : "none",
                      width: "16px",
                      height: "16px",
                      marginLeft: "20px",
                    }}
                  />
                </Typography>
              </Button>
            ) : (
              <Button
                variant="contained"
                component="label"
                disabled={props.challengesStatus[props.i] === "1" ? true : ""}
                className={classes.button}
                style={
                  props.challengesStatus[props.i] === "1"
                    ? {
                        color: "rgba(0, 0, 0, 0.26)",
                        boxShadow: "none",
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                        marginTop: "10px",
                      }
                    : {
                        background: "#FE7300",
                        color: "white",
                        marginTop: "10px",
                      }
                }
              >
                <img
                  src={file_upload}
                  style={{ marginRight: "5px" }}
                  alt="img"
                />{" "}
                <Typography
                  style={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Upload From File
                </Typography>
                <input
                  //accept="audio/*,video/*,image/*"
                  accept="video/*,image/*"
                  // video/*
                  className={classes.input}
                  style={{ display: "none" }}
                  // id="raised-button-file"
                  //multiple
                  //capture="environment"
                  type="file"
                  onChange={(e) => {
                    onChangePicture(e);
                  }}
                />
              </Button>
            )}
          </Grid>
          {/* <Grid>
            <Button
              onClick={(e) => {
                const constraints = (window.constraints = {
                  audio: false,
                  video: true,
                });

                function handleSuccess(stream) {
                  console.log(stream);
                  //const video = document.querySelector("video");
                  const videoTracks = stream.getVideoTracks();
                  console.log("Got stream with constraints:", constraints);
                  console.log(`Using video device: ${videoTracks[0].label}`);
                  //window.stream = stream; // make variable available to browser console
                  //video.srcObject = stream;
                }

                function handleError(error) {
                  if (error.name === "ConstraintNotSatisfiedError") {
                    const v = constraints.video;
                    alert(
                      `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
                    );
                  } else if (error.name === "PermissionDeniedError") {
                    alert(
                      "Permissions have not been granted to use your camera and " +
                        "microphone, you need to allow the page access to your devices in " +
                        "order for the demo to work."
                    );
                  }
                  alert(`getUserMedia error: ${error.name}`, error);
                }

                (async (e) => {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia(
                      constraints
                    );
                    window.localStream = stream;

                    handleSuccess(stream);
                    //e.target.disabled = true;
                  } catch (e) {
                    handleError(e);
                  }
                })();
              }}
            >
              TEST
            </Button>
            <Button
              onClick={() => {
                window.localStream.getTracks().forEach((track) => {
                  track.stop();
                });
              }}
            >
              STOP
            </Button>
          </Grid> */}
          {!isIos && !picture && (
            <Grid style={{ padding: "8px" }}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                style={{
                  // width:'25%',
                  // marginLeft:'-109px',
                  backgroundColor: "#FE7300",
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
                onClick={() => handleClickOpen()}
                // onClick = { ()=>handleSubmit() }
              >
                Upload from Camera
              </Button>
            </Grid>
          )}

          <Grid item style={{ padding: "8px" }}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              style={{
                // width:'25%',
                // marginLeft:'-109px',
                backgroundColor: "#FFFFFF",
                color: "#3C4858",
                textTransform: "capitalize",
                fontSize: "14px",
                lineHeight: "20px",
              }}
              onClick={props.handlePanel(props.panels[props.i])}
              // onClick = { ()=>handleSubmit() }
            >
              Cancel
            </Button>
          </Grid>

          <Grid>
            {props.openCamera ? (
              <Grid xs={12}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: "50%" }}
                  mirrored
                />
                <Grid xs={12}>
                  <button onClick={capture}>Capture photo</button>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            {props.openVideoCamera ? (
              <Grid xs={12}>
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  style={{ width: "42%" }}
                  mirrored
                />
                {capturing ? (
                  <button onClick={handleStopCaptureClick}>
                    Stop Recording
                  </button>
                ) : (
                  <button onClick={handleStartCaptureClick}>
                    Start Recording
                  </button>
                )}
                {/* {recordedChunks.length > 0 && (
                  <button onClick={handleDownload}>Download</button>
                )} */}
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <SimpleDialog
            open={open}
            onClose={handleClose}
            setOpenCamera={props.setOpenCamera}
            setOpenVideoCamera={props.setOpenVideoCamera}
            setOpen={setOpen}
          />
        </Grid>
      </div>
    );
  }
};

/* const browser = Bowser.getParser(window.navigator.userAgent);
    const browserEngine = browser.getEngineName(true);
    const browserName = browser.getBrowserName(true);
    
    //console.clear();
    console.log(window.navigator.userAgent);
    console.log(browserEngine);
    console.log(browserName);
    console.log(is.safari());

    alert(
      `${browserEngine}:::${browserName}:::${
        browserName === "safari" || browserEngine === "webkit"
      }`
    ); */

/* const mimeType =
      browserName === "safari" || browserEngine === "webkit"
        ? "video/mp4"
        : "video/webm;codecs=vp8,opus"; */

/* const mimeType =
      browserEngine === "webkit" ? "video/mp4" : "video/webm;codecs=vp8,opus"; */

/* mimeType: "video/webm",
      mimeType: `video/webm;codecs="vp9"`,
      mimeType: "video/webm;codecs=vp8,opus",
       mimeType: "video/mp4",
      'webkitRequestAnimationFrame' in window
      mimeType:
        OS === "iOS" || OS === "Mac OS"
          ? "video/mp4"
          : "video/webm;codecs=vp8,opus", */

/*     let mimeType = "";
    mimeType =
      window?.MediaRecorder?.isTypeSupported("video/mp4") && "video/mp4";
    mimeType =
      window?.MediaRecorder?.isTypeSupported("video/webm;codecs=vp8,opus") &&
      "video/webm;codecs=vp8,opus";

    mediaRecorderRef.current = new MediaRecorder(
      webcamRef.current.stream,
      mimeType
        ? {
            mimeType,
          }
        : {}
    ); */

export default ChallengeTypes;
