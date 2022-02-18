import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Crown from "../../static/images/Crown.png";
import one from "../../static/images/one.png";
import two from "../../static/images/two.png";
import three from "../../static/images/three.png";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
/* import RefreshIcon from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip"; */

import auth from "../../services/auth";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const LeaderBoard = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [leaderboardData, setLeaderboardData] = React.useState([]);
  console.log(leaderboardData[1],"sss")
  //let val=leaderboardData[1]["current-state"].split("/")
  
 function percentage1(){
  console.log((leaderboardData[1]["current-state"]),"data")
  let val=leaderboardData[1]["current-state"].split("/")
  let res=parseInt(val[0])/parseInt(val[1])*100
  console.log(val,typeof(val))
  console.log(res,"res")
  return <p>{ `(${Math.round(res)}%)`}</p>

 }

 function percentage2(){
  console.log((leaderboardData[0]["current-state"]),"data")
  let val=leaderboardData[0]["current-state"].split("/")
  let res=parseInt(val[0])/parseInt(val[1])*100
  console.log(val,typeof(val))
  console.log(res,"res")
  return <p>{ `(${Math.round(res)}%)`}</p>

 }

 function percentage3(){
  console.log((leaderboardData[2]["current-state"]),"data")
  let val=leaderboardData[2]["current-state"].split("/")
  let res=parseInt(val[0])/parseInt(val[1])*100
  console.log(val,typeof(val))
  console.log(res,"res")
  return <p>{ `(${Math.round(res)}%)`}</p>
 }
  
  
 
  
  // let percent=parseInt(leaderboardData[1]["current-state"])
  // let res=percent*100
  // console.log(res,"percent")
  // console.log(percent,"type")
  // console.log(15/34*100)
  // console.log(leaderboardData)

  React.useEffect(() => {
    (async function () {
      setLeaderboardData(props.leaderboardData);
      
    })();
  }, [props.leaderboardData]);

  /*   const handleRefreshClick = async () => {
    // setShowLoader(true);
    props.setOpen(true);
    let res = await auth.getLeaderboard(localStorage.getItem("game_id"));
    if (res.data !== undefined && res.data.length !== 0) {
      if (
        res.data.UserAttempt.filter(
          (e) => e.team_id === res.data.logged_in_user_array.team_id
        ).length > 0
      ) {
      } else {
        if (Object.keys(res.data.logged_in_user_array).length > 0) {
          res.data.UserAttempt.push(res.data.logged_in_user_array);
        }
      }
      setLeaderboardData(res.data.UserAttempt);
      await props.setlogged_in_user_array(res.data.logged_in_user_array);
      props.setOpen(false);
    } else {
      props.setOpenAlert(true);
      props.setOpen(false);
    }
  }; */

  return (
    <>
      {leaderboardData.length !== 0 && (
        <div style={{ background: "#E5E5E5", marginTop: "60px" }}>
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{
              //height: "320px",
              background: "#002E5A",
              paddingBottom: "15px",
              margin: "0px",
            }}
            spacing={1}
            xs={12}
          >
            <Grid item xs={12}>
              <Typography
                style={{
                  textAlign: "center",
                  fontSize: "36px",
                  lineHeight: "48px",
                  color: "white",
                  // marginTop: "32px",
                }}
              >
                Top 10 Scorers
              </Typography>
            </Grid>

            {/* <Grid item xs={12} align="center">
              <Chip
                size="small"
                label="Refresh"
                variant="outlined"
                icon={<RefreshIcon style={{ color: "white" }} />}
                onClick={handleRefreshClick}
                style={{
                  color: "white",
                  border: "1px solid white",
                  padding: "8px",
                  //backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              />
            </Grid> */}

            <Grid item xs={12} style={{ paddingBottom: "15px" }} align="center">
              <div style={{ width: !matches ? "50%" : "100%" }}>
                <Grid container justify="center" alignItems="flex-start">
                  {/* ************************************************************************************************** */}
                  {leaderboardData[1] && (
                    <Grid
                      item
                      xs={4}
                      style={{
                        paddingTop: !matches ? "15%" : "25%",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        props.gameType === "team" &&
                          (async () => {
                            const { data, status } =
                              await auth.leaderboardTeamDetails(
                                localStorage.getItem("game_id"),
                                leaderboardData[1].team_id,
                                leaderboardData[1].team_rank,
                               
                              );

                            //console.log(data);
                            status &&
                              props.setPopUpTeamOpen({
                                open: true,
                                canEdit:
                                  leaderboardData[1].team_id ===
                                  props.logged_in_user_array.team_id,
                                data,
                              });
                          })();
                      }}
                    >
                      <Avatar
                        alt=""
                        src={leaderboardData[1].team_image}
                        style={{
                          // marginTop: "10px",
                          width: "80px",
                          height: "80px",
                          border: "1px solid white",
                          display: "block",
                          margin: "0 auto",
                          // marginRight: "80px",
                          // marginTop: "50px",
                        }}
                      />
                      <Typography
                        style={{
                          textAlign: "center",
                          marginTop: "-10px",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <img src={two} alt="" />
                      </Typography>
                      <Typography
                        style={{ color: "white", textAlign: "center" }}
                      >
                        {leaderboardData[1].team_name}{" "}
                      </Typography>
                      <Typography
                        style={{ color: "white", textAlign: "center" }}
                      >
                        {leaderboardData[1].team_points} Pts
                      </Typography>
                      <Typography
                        style={{ color: "orange", textAlign: "center",fontSize:"14px"}}
                      >
                        {`(${leaderboardData[1]["current-state"]})`}
                        {percentage1()}
                      </Typography>
                    </Grid>
                  )}

                  {/* ******************************************************************************************************** */}
                  {leaderboardData[0] && (
                    <Grid
                      item
                      xs={4}
                      style={{ height: "100%", cursor: "pointer" }}
                      onClick={() => {
                        props.gameType === "team" &&
                          (async () => {
                            const { data, status } =
                              await auth.leaderboardTeamDetails(
                                localStorage.getItem("game_id"),
                                leaderboardData[0].team_id,
                                leaderboardData[0].team_rank,
                               
                              );

                            //console.log(data);
                            status &&
                              props.setPopUpTeamOpen({
                                open: true,
                                canEdit:
                                  leaderboardData[0].team_id ===
                                  props.logged_in_user_array.team_id,
                                data,
                              });
                          })();
                      }}
                    >
                      <Grid justify="center">
                        <img
                          src={Crown}
                          style={{ display: "block", margin: "auto" }}
                          alt=""
                        />
                      </Grid>
                      <Grid style={{ width: "100%" }}>
                        <Avatar
                          alt=""
                          src={leaderboardData[0].team_image}
                          style={{
                            // marginTop: "10px",
                            width: "112px",
                            height: "112px",
                            border: "1px solid white",
                            display: "block",
                            margin: "auto",
                            // marginRight: "80px",
                          }}
                        />
                        <Typography
                          style={{
                            textAlign: "center",
                            marginTop: "-10px",
                            position: "relative",
                            width: "112px",
                            margin: "-10px auto",
                          }}
                        >
                          <img src={one} alt="" />
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography
                          style={{ color: "white", textAlign: "center" }}
                        >
                          {leaderboardData[0].team_name}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography
                          style={{ color: "white", textAlign: "center" }}
                        >
                          {leaderboardData[0].team_points} Pts
                        </Typography>
                        <Typography
                        style={{ color: "orange", textAlign: "center",fontSize:"14px"}}
                      >
                        {`(${leaderboardData[0]["current-state"]}) `}
                        {percentage2()}
                      </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {/* ************************************************************************************************************ */}

                  {leaderboardData[2] && (
                    <Grid
                      item
                      xs={4}
                      style={{
                        paddingTop: !matches ? "15%" : "25%",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        props.gameType === "team" &&
                          (async () => {
                            const { data, status } =
                              await auth.leaderboardTeamDetails(
                                localStorage.getItem("game_id"),
                                leaderboardData[2].team_id,
                                leaderboardData[2].team_rank,
                                
                              );

                            //console.log(data);
                            status &&
                              props.setPopUpTeamOpen({
                                open: true,
                                canEdit:
                                  leaderboardData[2].team_id ===
                                  props.logged_in_user_array.team_id,
                                data,
                              });
                          })();
                      }}
                    >
                      <Avatar
                        alt=""
                        src={leaderboardData[2].team_image}
                        style={{
                          // marginTop: "10px",
                          width: "80px",
                          height: "80px",
                          border: "1px solid white",
                          display: "block",
                          margin: "0 auto",
                          // marginTop: "50px",
                        }}
                      />
                      <Typography
                        style={{
                          textAlign: "center",
                          marginTop: "-10px",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <img src={three} alt="" />
                      </Typography>
                      <Typography
                        style={{ color: "white", textAlign: "center" }}
                      >
                        {leaderboardData[2].team_name}
                      </Typography>
                      <Typography
                        style={{ color: "white", textAlign: "center" }}
                      >
                        {leaderboardData[2].team_points} Pts
                      </Typography>
                      <Typography
                        style={{ color: "orange", textAlign: "center",fontSize:"14px"}}
                      >
                        {`(${leaderboardData[2]["current-state"]}) `}
                        {percentage3()}
                      </Typography>
                    </Grid>
                  )}

                  {/* ************************************************************************************************************** */}
                </Grid>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            alignItems="center"
            justify="center"
            style={{
              // height: "200px",
              background: "#E5E5E5",
              width: matches ? "95%" : "60%",
              margin: "auto",
              marginTop: matches ? "-10px" : "-15px",
              display: "flex",
              borderRadius: "6px",
              paddingBottom: "3%",
            }}
          >
            {leaderboardData.slice(3).map((item, i = 4) => {
              return (
                <Grid
                  xs={12}
                  style={{
                    //height: "38px",
                    width: "50%",
                    borderTopRightRadius: i === 0 ? "6px" : "",
                    borderTopLeftRadius: i === 0 ? "6px" : "",
                    borderBottomRightRadius:
                      leaderboardData.slice(3).length - 1 === i ? "6px" : "",
                    borderBottomLeftRadius:
                      leaderboardData.slice(3).length - 1 === i ? "6px" : "",
                    background:
                      item.team_id === props.logged_in_user_array.team_id
                        ? "wheat"
                        : "white",
                  }}
                >
                  <Grid
                    container
                    style={{ padding: "8px" }}
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={1} md={1} align="center">
                      <div
                        style={{
                          color: "white",
                          fontSize: "14px",
                          width: "20px",
                          height: "20px",
                          textAlign: "center",
                          borderRadius: "50%",
                          background: "#FE7300",
                          padding: "2px",
                          lineHeight: "20px",
                        }}
                      >
                        {item.team_rank}
                      </div>
                    </Grid>
                    <Grid item xs={2} md={1} align="center">
                      <Avatar
                        alt="Remy Sharp"
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                        src={item.team_image}
                      />
                    </Grid>
                    <Grid item xs={4} md={5}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          height: "100%",
                        }}
                      >
                        <Typography style={{ fontSize: "14px" }}>
                          {item.team_name}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={props.gameType === "team" ? 3 : 5}
                      md={props.gameType === "team" ? 3 : 5}
                      style={
                        !matches && props.gameType === "team"
                          ? {
                              borderRight: `1px solid ${
                                item.team_id ===
                                props.logged_in_user_array.team_id
                                  ? "white"
                                  : "#E5E9F2"
                              }`,
                            }
                          : {}
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          height: "100%",
                          float: "right",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: "14px",
                            paddingRight: !matches ? "20px" : "0px",
                          }}
                        >
                           <span style={{color:"orange",fontSize:"12px"}}>
                          {item["current-state"] !== undefined ?`(${item['current-state']}) `:"(0) "}
                          </span>
                          {item.team_points} Pts
                        </Typography>
                      </div>
                    </Grid>
                    {props.gameType === "team" && (
                      <Grid item xs={2} md={2}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            height: "100%",
                            //float: "center",
                            justifyContent: "center",
                          }}
                        >
                          {!matches ? (
                            <Typography
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                color:
                                  item.team_id ===
                                  props.logged_in_user_array.team_id
                                    ? "white"
                                    : "#FE7300",
                              }}
                              onClick={() => {
                                (async () => {
                                  const { data, status } =
                                    await auth.leaderboardTeamDetails(
                                      localStorage.getItem("game_id"),
                                      item.team_id,
                                      item.team_rank
                                    );

                                  status &&
                                    props.setPopUpTeamOpen({
                                      open: true,
                                      canEdit:
                                        item.team_id ===
                                        props.logged_in_user_array.team_id,
                                      data,
                                    });
                                })();
                              }}
                            >
                              {item.team_id ===
                              props.logged_in_user_array.team_id
                                ? "Manage Team"
                                : "View Team"}
                            </Typography>
                          ) : (
                            <ChevronRightIcon
                              style={{
                                cursor: "pointer",
                                color:
                                  item.team_id ===
                                  props.logged_in_user_array.team_id
                                    ? "white"
                                    : "#8391A7",
                              }}
                              onClick={() => {
                                (async () => {
                                  const { data, status } =
                                    await auth.leaderboardTeamDetails(
                                      localStorage.getItem("game_id"),
                                      item.team_id,
                                      item.team_rank
                                    );

                                  //console.log(data);
                                  status &&
                                    props.setPopUpTeamOpen({
                                      open: true,
                                      canEdit:
                                        item.team_id ===
                                        props.logged_in_user_array.team_id,
                                      data,
                                    });
                                })();
                              }}
                            />
                          )}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              );
            })}

            {props.myRank && (
              <>
                <Grid item xs={12} style={{ paddingTop: "16px" }}>
                  <Typography>Your Rank</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    width: "50%",
                    borderRadius: "6px",
                    background: "#FE7300",
                    marginTop: "8px",
                  }}
                >
                  <Grid
                    container
                    style={{ padding: "8px" }}
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={1} md={1} align="center">
                      <div
                        style={{
                          color: "#FE7300",
                          fontSize: "14px",
                          width: "20px",
                          height: "20px",
                          textAlign: "center",
                          borderRadius: "50%",
                          background: "white",
                          padding: "2px",
                          lineHeight: "20px",
                        }}
                      >
                        {props.myRank.team_rank}
                      </div>
                    </Grid>
                    <Grid item xs={2} md={1} align="center">
                      <Avatar
                        alt="Remy Sharp"
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                        src={props.myRank.team_image}
                      />
                    </Grid>
                    <Grid item xs={4} md={5}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          height: "100%",
                          color: "white",
                        }}
                      >
                        <Typography style={{ fontSize: "14px" }}>
                          {props.myRank.team_name} {`(You)`}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={props.gameType === "team" ? 3 : 5}
                      md={props.gameType === "team" ? 3 : 5}
                      style={
                        !matches && props.gameType === "team"
                          ? {
                              borderRight: `1px solid white`,
                            }
                          : {}
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          height: "100%",
                          float: "right",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: "14px",
                            color: "white",
                            paddingRight: !matches ? "20px" : "0px",
                          }}
                        >
                          {props.myRank.team_points} Pts
                        </Typography>
                      </div>
                    </Grid>
                    {props.gameType === "team" && (
                      <Grid item xs={2} md={2}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            height: "100%",
                            //float: "right",
                            justifyContent: "center",
                          }}
                        >
                          {!matches ? (
                            <Typography
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "white",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                (async () => {
                                  const { data, status } =
                                    await auth.leaderboardTeamDetails(
                                      localStorage.getItem("game_id"),
                                      props.myRank.team_id,
                                      props.myRank.team_rank
                                    );

                                  //console.log(data);
                                  status &&
                                    props.setPopUpTeamOpen({
                                      open: true,
                                      canEdit: true,
                                      data,
                                    });
                                })();
                              }}
                            >
                              {"Manage Team"}
                            </Typography>
                          ) : (
                            <ChevronRightIcon
                              style={{ color: "white", cursor: "pointer" }}
                              onClick={() => {
                                (async () => {
                                  const { data, status } =
                                    await auth.leaderboardTeamDetails(
                                      localStorage.getItem("game_id"),
                                      props.myRank.team_id,
                                      props.myRank.team_rank
                                    );

                                  //console.log(data);
                                  status &&
                                    props.setPopUpTeamOpen({
                                      open: true,
                                      canEdit: true,
                                      data,
                                    });
                                })();
                              }}
                            />
                          )}
                        </div>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </div>
      )}
    </>
  );
};

export default LeaderBoard;
