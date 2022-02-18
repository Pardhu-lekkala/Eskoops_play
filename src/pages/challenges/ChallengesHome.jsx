import React, { useState, useEffect } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Grid, Avatar, Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ttb from "../../static/images/ttb.svg";
import error_background from "../../static/images/error_background.png";
import LeaderBoard from "../leaderBoard/LeaderBoard";
import scrolltop from "../../static/images/scrolltop.png";
import answered from "../../static/images/answered.png";
import GoldIcon from "../../static/images/GoldIcon.png";
import arrowDown from "../../static/images/arrow-down.gif";

import { history } from "../../routers/history";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import auth from "../../services/auth";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import crypto from "crypto";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import AppBar from "@material-ui/core/AppBar";
import WallOfFame from "../wallOfFame/WallOfFame";
import ChallengeTypes from "./ChallengeTypes";
import EditProfile from "../editProfile/EditProfile";
import Hidden from "@material-ui/core/Hidden";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import BarChartIcon from "@material-ui/icons/BarChart";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";

import ShowAnswerDialog from "./ShowAnswerDialog";
import ShowTeamDialog from "./ShowTeamDialog";
import ShowMatchTheFollowingDialog from "./ShowMatchTheFollowingDialog";
import TimeLeft from './TimeLeft';
import ScoredByTotal from './ScoredByTotal';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ScrollToView = ({ isLast }) => {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      if (isLast) {
        setTimeout(function () {
          window.scrollTo(0, window.document.body.scrollHeight);
        }, 400);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={scrollRef} id="test"></div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    minHeight: "100vh",
    background: "#002146",
  },
  root: {
    flexGrow: 1,
  },
  logo: {
    height: "4.5rem",
    width: "11.75rem",
    // paddingRight: '0.5rem',
    cursor: "pointer",
    marginTop: "64px",
    marginLeft: "15%",
    // [theme.breakpoints.down('sm')]: {
    //   height: '26px',
    // },
  },
  circularLoader: {
    height: "30px",
    width: "30px",
    color: "white",
  },
  rootAlert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  MuiAccordionroot: {
    "&.MuiAccordion-root:before": {
      backgroundColor: "white",
    },
    boxShadow: "none",
  },
  cardroot: {
    maxWidth: 1045,
    margin: "0px auto",
    //paddingTop: "32px",
    // marginLeft:'190px',
    // marginTop:'32px',
    //width: "100%",
  },
  cardmedia: {
    height: 454,
  },
  media: {
    height: 340,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },

  logoMobile: {
    marginLeft: "20px",
    marginTop: "4px",
    marginBottom: "4px",
    width: "125.33px",
  },
  edit: {
    textAlign: "center",
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
  title: {
    fontSize: "24px",
    color: "#FFFFFF",
    textAlign: "center",
    margin: "16px",
    width: "60%",
  },
  myBtn: {
    display: "block",
    position: "fixed",
    bottom: "20px",
    right: "30px",
    zIndex: 99,
    cursor: "pointer",
  },
  WallOfFameroot: {
    [theme.breakpoints.down("md")]: {
      margin: "0px 6px",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: 720,
      margin: "auto", //maxHeight: 464, //marginLeft: "32%", //marginTop: "30px",
    },
  },
  button: {
    marginTop: theme.spacing(1),
    width: "100%",
    borderRadius: "8px",
    background: "#FE7300",
    "&:hover": {
      backgroundColor: "#FE7300",
    },
  },
}));

const Challenges = (props) => {
  const classes = useStyles();

  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const userImage = localStorage.getItem("image");

  const [userLoggedInTime, setUserLoggedInTime] = useState('');
  const [gameDuration, setGameDuration] = useState(0);

  const [challengeType, setChallengeType] = useState('');

  const [gameTotalPoints, setGameTotalPoints] = useState(0);
  const [scoredTotalPoints, setScoredTotalPoints] = useState(0);

  const [showSubmitFirstModal, setShowSubmitFirstModal] = useState(false);

  const [challengesArrayData, setChallengesArrayData] = useState([]);
  const [currentlyAnswering, setCurrentlyAnswering] = useState(0);

  const [value, setValue] = React.useState(0);
  const [challengesData, setchallengesData] = React.useState([]);
  const [challengesStatus, setChallengesStatus] = React.useState([]);
  const [wallOfFameData, setWallOfFameData] = React.useState([]);
  const [allWallOfFameData, setAllWallOfFameData] = React.useState([]);
  const [leaderboardData, setLeaderboardData] = React.useState([]);
  const [logged_in_user_array, setlogged_in_user_array] = React.useState({});
  const [expanded, setExpanded] = React.useState(false);
  const [showNow, setShowNow] = React.useState("challenges");
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openSuccessAlert, setSuccessOpenAlert] = React.useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [panels, setPanels] = useState([]);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [openVideoCamera, setOpenVideoCamera] = useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [selectedBtn, setSelectedBtn] = React.useState(1);
  const [popUpOpen, setPopUpOpen] = React.useState({
    open: false,
    data: "<p>TEST</p>",
  });
  const [gameType, setGameType] = React.useState("solo");
  //popUpTeamOpen={poppopUpTeamOpenTeamOpen} setPopUpTeamOpen={setPopUpTeamOpen}
  const [popUpTeamOpen, setPopUpTeamOpen] = React.useState({
    open: false,
    canEdit: false,
    data: {},
  });
  const [popUpMTFOpen, setPopUpMTFOpen] = React.useState({
    open: false,
    data: {},
  });

  const [challengeScroll, setChallengeScroll] = React.useState(0);
  const [wallOfFameScroll, setWallOfFameScroll] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (showNow === "challenges") {
        setChallengeScroll(currPos.y);
      } else if (showNow === "Wall of Fame") {
        setWallOfFameScroll(currPos.y);
      }
    },
    null,
    null,
    true,
    300
  );
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  // const handleAlertOpen = () => {
  //   setOpenAlert(true);
  // };

  const tryAgain = () => {
    if (showNow === "challenges") {
      window.location.reload();
    }
    if (showNow === "Wall of Fame") {
      getWallOfFame();
    }
    if (showNow === "Leaderboard") {
      getLeaderboard();
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  /*   const handleSuccessAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessOpenAlert(false);
  }; */

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSmall = useMediaQuery(theme.breakpoints.down("sm"));
  /*   useEffect(() => {
    (async function () {
      setOpen(true);
    })();
  }, []); */

  const [challengeIdArr, setChallengeIdArr] = useState([]); //PAGINATINATED ID'S
  const [challengePage, setChallengePage] = useState(0); //PAGINATINATED ID'S
  const [trigger, setTrigger] = useState(crypto.randomBytes(13));
  const [errorText, setErrorText] = useState("Some thing went wrong!");

  const [myRank, setMyRank] = useState(null);

  useEffect(() => { console.log('challenge page: ', challengePage, ' current answering: ', currentlyAnswering) }, [challengePage, currentlyAnswering]);

  const firstFetch = async () => {
    // if (props.location.accessCode && props.location.emailAddress) {
    //   setAccessCode(props.location.accessCode);
    //   setEmailAddress(props.location.emailAddress);
    // }
    setOpen(true);
    let res = await auth.getChallengesIdsPAGINATION(
      localStorage.getItem("game_id")
    );
    if (res.data !== undefined) {
      setUserLoggedInTime(res.data.user_logged_in_time);
      setGameDuration(res.data.game_duration);
      setChallengeType(res.data.challenge_show_type)
      setChallengesArrayData(res.data.challenges);
      setGameTotalPoints(res.data.game_challenges_total_points);
      setScoredTotalPoints(res.data.scored_points?.total_points);

      // let count = 0;
      // for (const key in res.data.challenges) {
      //   if (res.data.challenges[key].challenge_submitted === '1') {
      //     count = key;
      //     continue;
      //   }
      //   break;
      // }
      // console.log(count)
      // setCurrentlyAnswering(parseInt(count));

      setChallengePage(challengePage + 1);

      let i,
        j,
        temparray,
        chunk = 1;
      let ids = [];
      for (i = 0, j = res.challenge_ids.length; i < j; i += chunk) {
        temparray = res.challenge_ids.slice(i, i + chunk);
        ids.push(temparray);
      }
      setChallengeIdArr(ids);

      if (res.data.challenge_show_type === '1-by-1') {
        if (ids.length > 0) {
          let response = await auth.getChallengesPAGINATION(
            localStorage.getItem("game_id"),
            ids[0]
          );
          setchallengesData([...response.array]);
          setShowLoader(false);
        }
      } else if (res.data.challenge_show_type === '4-by-4') {
        let challengeNumber = 0;
        let tempArray = [];
        for (let i = 0; i < 4; i++) {
          if (ids.length > challengeNumber) {
            let response = await auth.getChallengesPAGINATION(
              localStorage.getItem("game_id"),
              ids[challengeNumber]
            );
            tempArray = [...tempArray, ...response.array]
            challengeNumber++;
          }
        }
        setChallengePage(challengeNumber);
        setchallengesData([...challengesData, ...tempArray]);
        setShowLoader(false);
      }

      setChallengesStatus(res.challenge_status);
      setPanels(res.challenge_ids);

      setOpen(false);
    } else {
      if (res.accessCode !== 429) {
      }
      setOpenAlert(true);
      setErrorText(res?.err?.message);
      setShowErrorPage(true);
      setOpen(false);
    }
  };

  const refreshChallenges = async () => {
    await firstFetch();
  };

  useEffect(() => {
    // PAGINATION OF RESPONSE
    firstFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNextChallenge = async () => {
    if (challengeType === '1-by-1') {
      if (challengeIdArr.length > challengePage) {
        let response = await auth.getChallengesPAGINATION(
          localStorage.getItem("game_id"),
          challengeIdArr[challengePage]
        );
        setchallengesData([...challengesData, ...response.array]);
        setChallengePage(challengePage + 1);
        setShowLoader(false);
        setCurrentlyAnswering(currentlyAnswering + 1);
      }
    } else if (challengeType === '4-by-4') {
      let challengeNumber = challengePage;
      let tempArray = [];
      for (let i = 0; i < 4; i++) {
        if (challengeIdArr.length > challengeNumber) {
          let response = await auth.getChallengesPAGINATION(
            localStorage.getItem("game_id"),
            challengeIdArr[challengeNumber]
          );
          tempArray = [...tempArray, ...response.array]
          challengeNumber++;
        }
      }
      setChallengePage(challengeNumber)
      setchallengesData([...challengesData, ...tempArray]);
      setShowLoader(false);
    }
  };

  /* ************************************************************************************************* */

  const getChallenges = async () => {
    //setOpen(true);

    setTimeout(() => window.scrollTo(0, challengeScroll), 0);
    setShowNow("challenges");

    /* let res = await auth.getChallenges(localStorage.getItem("game_id"));
    if (res.data !== undefined) {
      await setchallengesData(res.array);
      await setChallengesStatus(res.challenge_status);
      setOpen(false);
    } else {
      setOpenAlert(true);
      setOpen(false);
    } */
  };

  const getWallOfFame = async () => {
    window.scrollTo(0, 0);
    setShowNow("Wall of Fame");

    // if (wallOfFameData.length === 0) {
    setOpen(true);
    let res = await auth.getWallOfFame(
      localStorage.getItem("game_id"),
      "?page=1"
    );
    if (
      res.data !== undefined &&
      res.data.length !== 0 &&
      res.data.status === "true"
    ) {
      setWallOfFameData(res.data.UserAttempt.data);
      setAllWallOfFameData(res.data);
      setOpen(false);
    } else {
      setOpenAlert(true);
      setShowErrorPage(true);
      setErrorText(res.err.message);
      setOpen(false);
    }
    // }
  };

  const getLeaderboard = async () => {
    setOpen(true);
    setShowNow("Leaderboard");
    let res = await auth.getLeaderboard(localStorage.getItem("game_id"));
    if (
      res.data !== undefined &&
      res.data.UserAttempt.length !== 0 &&
      res.data.status === "true"
    ) {
      let data = [];
      if (
        res.data.UserAttempt.filter(
          (e) => e.team_id === res.data.logged_in_user_array.team_id
        ).length > 0
      ) {
        /* vendors contains the element we're looking for */
        data = [...res.data.UserAttempt];
        setMyRank(null);
      } else {
        if (Object.keys(res.data.logged_in_user_array).length > 0) {
          data = [
            ...res.data.UserAttempt,
            //res.data.logged_in_user_array
          ];
          setMyRank(res.data.logged_in_user_array);
          //res.data.UserAttempt.push(res.data.logged_in_user_array);
        }
      }
      setLeaderboardData(data);
      setGameType(res.data.game_type);
      setlogged_in_user_array(res.data.logged_in_user_array);
      setOpen(false);
    } else {
      setErrorText("Something went wrong");
      setOpenAlert(true);
      setShowErrorPage(true);
      setOpen(false);
    }
  };

  const handlePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setOpenCamera(false);
    setOpenVideoCamera(false);
    setCapturing(false);
    setRecordedChunks([]);
  };

  //var mybutton = document.getElementById("myBtn");

  React.useEffect(() => {
    // When the user scrolls down 20px from the top of the document, show the button
    // When the user clicks on the button, scroll to the top of the document
  });

  // window.onscroll = function () {
  //   scrollFunction();
  // };

  // function scrollFunction() {
  //   if (
  //     document.body.scrollTop > 20 ||
  //     document.documentElement.scrollTop > 20
  //   ) {
  //     document.getElementById("myBtn").style.display = "block";
  //   } else {
  //     document.getElementById("myBtn").style.display = "none";
  //   }
  // }

  function topFunction() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="allRoot">
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container direction="row" justify="center">
        <Grid container item direction="column" style={{ display: "unset" }}>
          <Grid item xs={4} style={{ background: "#FFFFFF", maxWidth: "100%" }}>
            <Grid container>
              <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <Alert onClose={handleAlertClose} severity="error">
                  {errorText}
                </Alert>
              </Snackbar>
              {refresh ? (
                <AppBar position="fixed">
                  <Paper className={classes.root}>
                    <Grid container direction="row">
                      <Grid
                        item
                        style={{
                          textAlign: "left",
                          paddingLeft: !matches ? "16px" : "0px",
                        }}
                        xs={2}
                        align="center"
                        justify="center"
                      >
                        <Hidden mdDown>
                          <img
                            //src={ttb}
                            src={
                              localStorage.getItem("game_image")
                                ? localStorage.getItem("game_image")
                                : ttb
                            }
                            height="48"
                            width="66"
                            style={{ padding: "4px" }}
                            //className={classes.logoMobile}
                            alt="logo"
                            onClick={() => history.push("/challenges")}
                          />
                        </Hidden>
                        <Hidden mdUp>
                          <img
                            //src={ttb}
                            src={
                              localStorage.getItem("game_image")
                                ? localStorage.getItem("game_image")
                                : ttb
                            }
                            height="48"
                            width="66"
                            style={{ padding: "4px" }}
                            //className={classes.logoMobile}
                            alt="logo"
                            onClick={() => history.push("/challenges")}
                          />
                        </Hidden>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                      //style={{ marginTop: "37px" }}
                      //style={{ marginTop: "20px" }}
                      >
                        <Hidden mdUp>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="black"
                            centered
                            style={{ paddingTop: "12px" }}
                          >
                            <Tab
                              //label="Challenge"
                              icon={
                                <Tooltip title="Challenges">
                                  <FlagOutlinedIcon
                                    style={
                                      value === 0 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => {
                                getChallenges();
                              }}
                            />
                            <Tab
                              icon={
                                <Tooltip title="Wall of Fame">
                                  <DashboardOutlinedIcon
                                    style={
                                      value === 1 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => {
                                getWallOfFame();
                              }}
                            />
                            <Tab
                              //label="Leaderboard"
                              icon={
                                <Tooltip title="Leader Board">
                                  <BarChartIcon
                                    style={
                                      value === 2 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => getLeaderboard()}
                            />
                          </Tabs>
                        </Hidden>
                        <Hidden mdDown>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="black"
                            centered
                            style={{ paddingTop: "12px" }}
                          >
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <FlagOutlinedIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Challenge
                                  </span>
                                </div>
                              }
                              style={value === 0 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getChallenges();
                              }}
                            />
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <DashboardOutlinedIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Wall of Fame
                                  </span>
                                </div>
                              }
                              style={value === 1 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getWallOfFame();
                              }}
                            />
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <BarChartIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Leaderboard
                                  </span>
                                </div>
                              }
                              style={value === 2 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getLeaderboard();
                              }}
                            />
                          </Tabs>
                        </Hidden>
                      </Grid>

                      <Grid
                        onClick={() => {
                          setShowNow("Profile");
                          setValue("");
                        }}
                        style={{
                          cursor: "pointer",
                          //marginTop: "5px",
                        }}
                        item
                        xs={2}
                      //justify="center"
                      >
                        <Hidden mdUp>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              height: "100%",
                            }}
                          >
                            <Avatar
                              alt=""
                              src={userImage}
                            />
                          </div>
                        </Hidden>
                        <Hidden mdDown>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              height: "100%",
                            }}
                          >
                            <Avatar
                              alt=""
                              src={userImage}
                            />
                            <Typography
                              style={{ paddingLeft: "3px", fontWeight: "bold" }}
                            >
                              {localStorage.getItem("first_name")}
                            </Typography>
                          </div>
                        </Hidden>
                      </Grid>
                    </Grid>
                  </Paper>
                </AppBar>
              ) : (
                <AppBar position="fixed">
                  <Paper className={classes.root}>
                    <Grid container direction="row">
                      <Grid
                        item
                        style={{
                          textAlign: "left",
                          paddingLeft: !matches ? "16px" : "0px",
                        }}
                        xs={2}
                        align="center"
                        justify="center"
                      >
                        <Hidden mdDown>
                          <img
                            //src={ttb}
                            src={
                              localStorage.getItem("game_image")
                                ? localStorage.getItem("game_image")
                                : ttb
                            }
                            height="48"
                            width="66"
                            style={{ padding: "4px" }}
                            //className={classes.logoMobile}
                            alt="logo"
                            onClick={() => history.push("/challenges")}
                          />
                        </Hidden>
                        <Hidden mdUp>
                          <img
                            //src={ttb}
                            src={
                              localStorage.getItem("game_image")
                                ? localStorage.getItem("game_image")
                                : ttb
                            }
                            height="48"
                            width="66"
                            style={{ padding: "4px" }}
                            //className={classes.logoMobile}
                            alt="logo"
                            onClick={() => history.push("/challenges")}
                          />
                        </Hidden>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                      //style={{ marginTop: "37px" }}
                      //style={{ marginTop: "20px" }}
                      >
                        <Hidden mdUp>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="black"
                            centered
                            style={{ paddingTop: "12px" }}
                          >
                            <Tab
                              //label="Challenge"
                              icon={
                                <Tooltip title="Challenges">
                                  <FlagOutlinedIcon
                                    style={
                                      value === 0 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => getChallenges()}
                            />
                            {/* <Tab label="Chat" onClick={()=>setShowNow('Chat')}/> */}
                            <Tab
                              //label="Wall of Fame"
                              icon={
                                <Tooltip title="Wall of Fame">
                                  <DashboardOutlinedIcon
                                    style={
                                      value === 1 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => getWallOfFame()}
                            />
                            <Tab
                              //label="Leaderboard"
                              icon={
                                <Tooltip title="Leader Board">
                                  <BarChartIcon
                                    style={
                                      value === 2 ? { color: "#FE7300" } : {}
                                    }
                                  />
                                </Tooltip>
                              }
                              onClick={() => getLeaderboard()}
                            />
                          </Tabs>
                        </Hidden>
                        <Hidden mdDown>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="black"
                            centered
                            style={{ paddingTop: "12px" }}
                          >
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <FlagOutlinedIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Challenge
                                  </span>
                                </div>
                              }
                              style={value === 0 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getChallenges();
                              }}
                            />
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <DashboardOutlinedIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Wall of Fame
                                  </span>
                                </div>
                              }
                              style={value === 1 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getWallOfFame();
                              }}
                            />
                            <Tab
                              label={
                                <div style={{ textTransform: "Capitalize" }}>
                                  <BarChartIcon
                                    style={{
                                      verticalAlign: "middle",
                                    }}
                                  />
                                  <span
                                    style={{
                                      verticalAlign: "middle",
                                      paddingLeft: "2px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Leaderboard
                                  </span>
                                </div>
                              }
                              style={value === 2 ? { color: "#FE7300" } : {}}
                              onClick={() => {
                                getLeaderboard();
                              }}
                            />
                          </Tabs>
                        </Hidden>
                      </Grid>

                      <Grid
                        onClick={() => {
                          setShowNow("Profile");
                          setValue("");
                        }}
                        style={{
                          cursor: "pointer",
                          //marginTop: "5px",
                        }}
                        item
                        xs={2}
                      //justify="center"
                      >
                        <Hidden mdUp>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              height: "100%",
                            }}
                          >
                            <Avatar
                              alt=""
                              src={userImage}
                            />
                          </div>
                        </Hidden>
                        <Hidden mdDown>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              height: "100%",
                            }}
                          >
                            <Avatar
                              alt=""
                              src={userImage}
                            />
                            <Typography
                              style={{ paddingLeft: "3px", fontWeight: "bold" }}
                            >
                              {localStorage.getItem("first_name")}
                            </Typography>
                          </div>
                        </Hidden>
                      </Grid>
                    </Grid>
                  </Paper>
                </AppBar>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* ******************************************************************************************** */}
      {showNow === "challenges" ? (
        <>
          {challengesData.length !== 0 && (
            <div style={{ background: "#E5E5E5" }}>
              <Grid
                container
                spacing={2}
                justify="center"
                xs={12}
                //style={{ paddingTop: "80px", margin: 0, width: "100%" }}
                style={{ paddingTop: "95px", margin: "0 auto" }}
              >
                <Grid
                  item
                  md={12}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    position: "fixed",
                    top: 60,
                    zIndex: 100,
                  }}
                  justify="center"
                >
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    size="small"
                  >
                    <Button
                      color={selectedBtn === 1 ? "primary" : "grey"}
                      onClick={() => setSelectedBtn(1)}
                      style={{ textTransform: "none" }}
                    >
                      All
                    </Button>
                    <Button
                      color={selectedBtn === 2 ? "primary" : "grey"}
                      onClick={() => setSelectedBtn(2)}
                      style={{ textTransform: "none" }}
                    >
                      Unanswered
                    </Button>
                    <Button
                      color={selectedBtn === 3 ? "primary" : "grey"}
                      onClick={() => setSelectedBtn(3)}
                      style={{ textTransform: "none" }}
                    >
                      Answered
                    </Button>
                  </ButtonGroup>
                </Grid>

                {/* <Hidden mdDown>
                  <Grid
                    item
                    xs={5}
                    md={2}
                    style={{ position: "absolute", right: "1%", top: 100 }}
                  >
                    <Button
                      color={"primary"}
                      variant="contained"
                      //size="small"
                      startIcon={<RefreshIcon />}
                      onClick={async () => {
                        await refreshChallenges();
                        window.scrollTo(0, 0);
                      }}
                      style={{ textTransform: "none", color: "white" }}
                    >
                      Refresh
                    </Button>
                  </Grid>
                </Hidden> */}
                {/* <Hidden mdUp>
                  <Grid
                    item
                    xs={12}
                    align="center"
                    style={{ paddingTop: "13px" }}
                  >
                    <Button
                      //color={"secondary"}
                      color={"primary"}
                      variant="contained"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={async () => {
                        await refreshChallenges();
                        window.scrollTo(0, 0);
                      }}
                      style={{ textTransform: "none", color: "white" }}
                    >
                      Refresh
                    </Button>
                  </Grid>
                </Hidden> */}

                {challengesData.map((item, i = 1) => {
                  if (selectedBtn === 2 && challengesStatus[i] === "1") {
                    //Unanswered
                    //condition = false;
                    return <></>;
                  } else if (selectedBtn === 3 && challengesStatus[i] !== "1") {
                    // Answered
                    //condition = false;
                    return <></>;
                  }
                  return (
                    <Grid item md={12} style={{ width: "100%" }}>
                      <Accordion
                        expanded={expanded === panels[i]}
                        onChange={
                          item.challenge_points === "0"
                            ? ""
                            : challengesStatus[i] === "1"
                              ? ""
                              : handlePanel(panels[i])
                        }
                        classes={{ root: classes.MuiAccordionroot }}
                        //className="challegesRoot"
                        style={{
                          maxWidth: 1045,
                          margin: "0px auto",
                          //background:item.challenge_points === "0" ? "#FE7300" : "",
                          border:
                            item.challenge_points === "0"
                              ? "2px solid #FE7300"
                              : "",
                        }}
                      >
                        <AccordionSummary
                          style={{ position: "relative" }}
                          IconButtonProps={{
                            style: {
                              position: "absolute",
                              right: "15px",
                              bottom: "0px",
                            },
                          }}
                          expandIcon={
                            item.challenge_points !== "0" ? (
                              <ExpandMoreIcon />
                            ) : (
                              ""
                            )
                          }
                        >
                          {item.challenge_points === "0" ? (
                            <div
                              style={{ zIndex: 60 }}
                              class="ribbon ribbon-top-left"
                            >
                              <span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {`info`}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}

                          <Card elevation={0} style={{ width: "100%" }}>
                            {!(
                              item.challenge_detail.includes("<img") ||
                              item.challenge_detail.includes("<video")
                            ) && (
                                <Grid>
                                  <CardActions
                                  //style={{float: "right"}}
                                  >
                                    <Typography
                                      style={{
                                        color: "green",
                                        float: "right",
                                        zIndex: 32,
                                        position: "relative",
                                      }}
                                    >
                                      {challengesStatus[i] === "1" ? (
                                        <img src={answered} alt="answered" />
                                      ) : (
                                        ""
                                      )}
                                    </Typography>
                                  </CardActions>
                                </Grid>
                              )}
                            <CardActionArea>
                              <Typography>
                                <div
                                  dangerouslySetInnerHTML={
                                    !item.challenge_detail.includes("<video")
                                      ? { __html: item.challenge_detail }
                                      : {
                                        __html: item.challenge_detail
                                          .replace(
                                            "<video",
                                            `<video style="width: 100%;min-width: 100%; ${!matchesSmall
                                              ? ""
                                              : "height: 210px;"
                                            }"`
                                          )
                                          .replace(
                                            "<p",
                                            `<p style="${!matches ? "" : "margin: 0px;"
                                            }"`
                                          ),
                                      }
                                  }
                                  style={{
                                    marginLeft: !matches ? "13px" : "0px",
                                    marginRight: !matches ? "13px" : "0px",
                                    marginBottom: !matches ? "30px" : "0px",
                                    zIndex: 31,
                                    position: "relative",
                                    marginTop: !matches ? "14px" : "0px",
                                    mixBlendMode:
                                      challengesStatus[i] === "1"
                                        ? "luminosity"
                                        : "",
                                  }}
                                ></div>
                                {item.challenge_detail.includes("<img") ||
                                  item.challenge_detail.includes("<video") ? (
                                  <CardActions
                                    style={{
                                      height: "50%",
                                      width: "50%",
                                      overflow: "auto",
                                      margin: "auto",
                                      position: "absolute",
                                      float: "left",
                                      top: "0",
                                      left: "0px",
                                      bottom: "0",
                                      right: "0",
                                      marginLeft: "0",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        color: "green",
                                        float: "right",
                                        zIndex: 32,
                                        position: "relative",
                                      }}
                                    >
                                      {challengesStatus[i] === "1" ? (
                                        <img src={answered} alt="answered" />
                                      ) : (
                                        ""
                                      )}
                                    </Typography>
                                  </CardActions>
                                ) : (
                                  ""
                                )}
                              </Typography>
                            </CardActionArea>
                            {item.challenge_points === "0" ? (
                              ""
                            ) : (
                              <Grid container style={{ width: "100%" }}>
                                <Grid
                                  item
                                  xs={6}
                                  style={{ paddingLeft: "10px" }}
                                >
                                  <Grid
                                    container
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Grid item>
                                      <img
                                        src={GoldIcon}
                                        style={{ float: "left" }}
                                        alt="img"
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Typography
                                        size="small"
                                        style={{ float: "left" }}
                                      >
                                        {item.challenge_points} points
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </Card>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* {expanded === panels[i] && (
                            <ScrollToView
                              expanded={expanded}
                              key={i}
                              isLast={panels.length - 1 === i}
                            />
                          )} */}
                          <ChallengeTypes
                            setGameTotalPoints={setGameTotalPoints}
                            setScoredTotalPoints={setScoredTotalPoints}
                            handleSetData={() => {
                              setChallengesArrayData(prevData => {
                                const newData = [];
                                for (const index in prevData) {
                                  if (parseInt(index) === parseInt(currentlyAnswering)) {
                                    newData.push({
                                      ...prevData[index],
                                      challenge_submitted: '1',
                                    });
                                    continue;
                                  }
                                  newData.push({
                                    ...prevData[index],
                                  });
                                }
                                console.log(newData)
                                return newData;
                              });
                              // setCurrentlyAnswering(currentlyAnswering + 1);
                            }}
                            setShowExpiredModal={() => setShowExpiredModal(true)}
                            setChallengesArrayData={setChallengesArrayData}
                            handlePanel={handlePanel}
                            i={i}
                            panels={panels}
                            setSuccessOpenAlert={setSuccessOpenAlert}
                            setOpenAlert={setOpenAlert}
                            item={item}
                            challengesStatus={challengesStatus}
                            setChallengesStatus={newArr => setChallengesStatus(newArr)}
                            setExpanded={setExpanded}
                            setOpenVideoCamera={setOpenVideoCamera}
                            openVideoCamera={openVideoCamera}
                            openCamera={openCamera}
                            setOpenCamera={setOpenCamera}
                            capturing={capturing}
                            setCapturing={setCapturing}
                            setRecordedChunks={setRecordedChunks}
                            recordedChunks={recordedChunks}
                            popUpOpen={popUpOpen}
                            setPopUpOpen={setPopUpOpen}
                            popUpMTFOpen={popUpMTFOpen}
                            setPopUpMTFOpen={setPopUpMTFOpen}
                          />
                          {expanded === panels[i] && (
                            <ScrollToView
                              expanded={expanded}
                              key={i}
                              isLast={panels.length - 1 === i}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  );
                })}
                <Grid item md={12}>
                  <Grid container justify="center">
                    {challengesData.length !== 0 &&
                      challengeIdArr.length > challengePage && (
                        <Button
                          style={{
                            background: "rgb(254, 115, 0)",
                            color: "white",
                            marginTop: "40px",
                            marginBottom: "40px",
                            textTransform: "initial",
                            borderRadius: "8px",
                          }}
                          // className={classes.button}
                          variant="contained"
                          onClick={() => {
                            if (challengeType === '1-by-1') {
                              if (challengesArrayData.length !== currentlyAnswering
                                && (challengesArrayData[parseInt(challengePage - 1)].challenge_submitted === '1'
                                  || challengesArrayData[parseInt(currentlyAnswering)].total_points === '0')) {
                                getNextChallenge();
                                setShowLoader(true);
                              } else {
                                // complete the challenge first
                                setShowSubmitFirstModal(true);
                              }
                            } else if (challengeType === '4-by-4') {
                              getNextChallenge();
                              setShowLoader(true);
                            }
                          }}
                        >
                          {/* Load more challenges */}
                          Load next challenge
                          <img
                            src={arrowDown}
                            alt="."
                            width="16px"
                            height="16px"
                            style={{
                              color: "white",
                              marginLeft: "20px",
                              display: !showLoader ? "block" : "none",
                            }}
                          />
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
                      )}
                    {challengesData.length !== 0 &&
                      challengeIdArr.length <= challengePage && (
                        <div style={{ height: "50px" }}></div>
                      )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
        </>
      ) : null}

      {showNow === "Wall of Fame" ? (
        <WallOfFame
          wallOfFameData={wallOfFameData}
          setWallOfFameData={setWallOfFameData}
          allWallOfFameData={allWallOfFameData}
          setAllWallOfFameData={setAllWallOfFameData}
          setShowLoader={setShowLoader}
          setOpen={setOpen}
          setOpenAlert={setOpenAlert}
        />
      ) : null}

      {showNow === "Profile" ? (
        <EditProfile setRefresh={setRefresh} refresh={refresh} />
      ) : null}

      {showNow === "Leaderboard" ? (
        <LeaderBoard
          leaderboardData={leaderboardData}
          logged_in_user_array={logged_in_user_array}
          setOpen={setOpen}
          setlogged_in_user_array={setlogged_in_user_array}
          setMyRank={setMyRank}
          myRank={myRank}
          popUpTeamOpen={popUpTeamOpen}
          setPopUpTeamOpen={setPopUpTeamOpen}
          gameType={gameType}
          setGameType={setGameType}
        />
      ) : null}

      {showErrorPage && (
        <Grid
          container
          md={12}
          style={{
            margin: "0 auto",
            width: "50%",
            paddingTop: matchesSmall ? "20%" : "13%",
          }}
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Grid item xs={12} align="center">
            <img src={error_background} alt="" />
          </Grid>
          <Grid item xs={12} align="center">
            <Typography>Something went wrong!</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              style={{
                background: "rgb(254, 115, 0)",
                color: "white",
                textTransform: "initial",
                borderRadius: "8px",
              }}
              // className={classes.button}
              variant="contained"
              onClick={() => {
                tryAgain();
              }}
            >
              Try again
            </Button>
          </Grid>
        </Grid>
      )}

      {challengesData.length !== 0 &&
        (showNow === "challenges" || showNow === "Wall of Fame") ? (
        <Typography
          id="myBtn"
          className={classes.myBtn}
          onClick={() => topFunction()}
        >
          <img src={scrolltop} alt="scrolltop" />
        </Typography>
      ) : (
        ""
      )}

      <ShowAnswerDialog popUpOpen={popUpOpen} setPopUpOpen={setPopUpOpen} />
      <ShowTeamDialog
        popUpTeamOpen={popUpTeamOpen}
        setPopUpTeamOpen={setPopUpTeamOpen}
        getLeaderboard={getLeaderboard}
      />
      <ShowMatchTheFollowingDialog
        popUpMTFOpen={popUpMTFOpen}
        setPopUpMTFOpen={setPopUpMTFOpen}
      />
      <Dialog
        open={showSubmitFirstModal}
        onClose={() => setShowSubmitFirstModal(false)}
      >
        <DialogTitle id="alert-dialog-title">
          Submit the answer before you proceed!
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowSubmitFirstModal(false)} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      <TimeLeft userLoginTime={userLoggedInTime} gameDuration={gameDuration} />
      <ScoredByTotal {...{ gameTotalPoints, scoredTotalPoints }} />
      <Dialog
        open={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
      >
        <DialogTitle id="alert-dialog-title">
          Time for this answer has expired!
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowExpiredModal(false)} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Challenges;
