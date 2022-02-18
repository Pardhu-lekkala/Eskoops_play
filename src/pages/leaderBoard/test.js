import React from "react";
import { Grid, Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Crown from "../../static/images/Crown.png";
import one from "../../static/images/one.png";
import two from "../../static/images/two.png";
import three from "../../static/images/three.png";
import Hidden from "@material-ui/core/Hidden";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RefreshIcon from "@material-ui/icons/Refresh";
import auth from "../../services/auth";
import Chip from "@material-ui/core/Chip";

const LeaderBoard = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const [leaderboardData, setLeaderboardData] = React.useState([]);

  React.useEffect(() => {
    (async function () {
      setLeaderboardData(props.leaderboardData);
    })();
  }, [props.leaderboardData]);

  const handleRefreshClick = async () => {
    // setShowLoader(true);
    props.setOpen(true);
    let res = await auth.getLeaderboard(localStorage.getItem("game_id"));
    if (res.data !== undefined && res.data.length !== 0) {
      if (
        res.data.UserAttempt.filter(
          (e) => e.team_id === res.data.logged_in_user_array.team_id
        ).length > 0
      ) {
        /* vendors contains the element we're looking for */
      } else {
        if (res.data.logged_in_user_array.length > 0) {
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
  };
  return (
    <div style={{ background: "#E5E5E5", marginTop: "60px" }}>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ height: "320px", background: "#002E5A" }}
        //spacing={1}
        xs={12}
      >
        <Hidden mdDown>
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
        </Hidden>
        <Hidden mdUp>
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
        </Hidden>
        <Hidden mdDown>
          {/* DESKTOP */}
          <Grid
            item
            md={12}
            align="center"
            style={{ marginTop: "-55px" }}
            //style={{ position: "absolute", right: "50%", top: "150px" }}
          >
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
          </Grid>
        </Hidden>
        <Hidden mdUp>
          {/* MOBILE */}
          <Grid
            item
            xs={12}
            align="center"
            //style={{ marginTop: "10px" }}
            style={{ marginTop: "-55px" }}
          >
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
          </Grid>
        </Hidden>

        <Grid item xs={12}>
          {leaderboardData.slice(2, 3).map(() => {
            return (
              <Grid
                container
                style={{ marginTop: "-60px", border: "2px solid red" }}
                md={12}
                // alignItems="center"
                justify="center"
              >
                <Grid md={2} xs={0} item style={{ border: "2px solid red" }}></Grid>
                <Grid
                  md={8}
                  xs={12}
                  justify="center"
                  container
                  //spacing={matches ? 2 : 10}
                  style={
                    !matches
                      ? { paddingRight: "25px",border: "2px solid red" }
                      : { paddingRight: "8px",border: "2px solid red" }
                  }
                >
                  <Grid
                    item
                    alignItems="flex-end"
                    style={{ border: "2px solid red" }}
                  >
                    <Grid
                      item
                      style={{ marginTop: "64px", border: "2px solid red" }}
                    >
                      <div>
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
                            border: "2px solid red",
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
                      </div>
                    </Grid>
                  </Grid>
                  {/* ONE */}
                  <Grid
                    item
                    justify="center"
                    style={{ border: "2px solid red" }}
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
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    alignItems="flex-end"
                    style={{ border: "2px solid red" }}
                  >
                    <Grid
                      item
                      style={{ marginTop: "64px", border: "2px solid red" }}
                    >
                      <div>
                        <Avatar
                          alt="Remy Sharp"
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
                            border: "2px solid red",
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
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid md={2} xs={0} item style={{ border: "2px solid red" }}></Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justify="center"
        style={{
          // height: "200px",
          background: "#E5E5E5",
          width: matches ? "95%" : "43%",
          margin: "auto",
          marginTop: matches ? "-10px" : "-15px",
          display: "flex",
          borderRadius: "6px",
        }}
      >
        {leaderboardData.slice(3).map((item, i = 4) => {
          return (
            <Grid
              xs={12}
              style={{
                height: "38px",
                width: "50%",
                borderTopRightRadius: i === 0 ? "6px" : "",
                borderTopLeftRadius: i === 0 ? "6px" : "",
                background:
                  item.team_id === props.logged_in_user_array.team_id
                    ? "wheat"
                    : "white",
              }}
            >
              <div
                style={{
                  float: "left",
                  margin: "10px",
                  color: "white",
                  fontSize: "14px",
                  width: "20px",
                  height: "20px",
                  textAlign: "center",
                  borderRadius: "50%",
                  background: "#FE7300",
                  padding: "2px",
                }}
              >
                {item.team_rank}
              </div>
              <Avatar
                alt="Remy Sharp"
                style={{
                  float: "left",
                  margin: "5px 10px 10px 10px",
                  width: "30px",
                  height: "30px",
                }}
                src={item.team_image}
              />
              <Typography
                style={{ float: "left", margin: "10px", fontSize: "14px" }}
              >
                {item.team_name}
              </Typography>
              <Typography
                style={{ float: "right", margin: "10px", fontSize: "14px" }}
              >
                {item.team_points} Pts
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default LeaderBoard;
