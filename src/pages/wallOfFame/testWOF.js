import React, { useState } from "react";
import { Grid, Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import GoldIcon from "../../static/images/GoldIcon.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import Hidden from "@material-ui/core/Hidden";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import CarouselCustom from "./Switch.js";
import RefreshIcon from "@material-ui/icons/Refresh";

import auth from "../../services/auth";

const useStyles = makeStyles((theme) => ({
  WallOfFameroot: {
    [theme.breakpoints.down("md")]: {
      //minWidth: "100vw",
      //maxWidth: "100vw",
      margin: "0px 6px",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: 720,
      margin: "auto", //maxHeight: 464, //marginLeft: "32%", //marginTop: "30px",
    },
  },
  circularLoader: {
    height: "30px",
    width: "30px",
    color: "white",
  },
}));

const WallOfFame = (props) => {
  const classes = useStyles({});
  const theme = useTheme();

  const [showLoader, setShowLoader] = useState(false);

  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const handlePaginationClick = async () => {
    setShowLoader(true);
    props.setOpen(true);

    let res = await auth.getWallOfFame(
      localStorage.getItem("game_id"),
      props.allWallOfFameData?.UserAttempt?.next_page_url?.slice(1)
    );
    if (res.data !== undefined && res.data.length !== 0) {
      props.setWallOfFameData([
        ...props.wallOfFameData,
        ...res.data.UserAttempt.data,
      ]);
      props.setAllWallOfFameData(res.data);
      props.setOpen(false);
      setShowLoader(false);
    } else {
      setShowLoader(false);
      props.setOpenAlert(true);
      props.setOpen(false);
    }
  };

  const handleRefreshClick = async () => {
    setShowLoader(true);
    props.setOpen(true);

    let res = await auth.getWallOfFame(
      localStorage.getItem("game_id"),
      "?page=1"
    );

    if (res.data !== undefined && res.data.length !== 0) {
      props.setWallOfFameData([...res.data.UserAttempt.data]);
      props.setAllWallOfFameData(res.data);
      props.setOpen(false);
    } else {
      props.setOpenAlert(true);
      props.setOpen(false);
    }
  };

  return (
    <>
      {props.wallOfFameData.length !== 0 && (
        <div style={{ background: "#E5E5E5", paddingTop: "80px" }}>
          <Grid container spacing={1} xs={12} style={{ width: "100%" }}>
            <Hidden mdDown>
              <Grid
                item
                xs={5}
                md={2}
                style={{ position: "absolute", right: "10%", top: "80px" }}
              >
                {props.allWallOfFameData?.UserAttempt && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefreshClick}
                    style={{ color: "white", textTransform: "capitalize" }}
                  >
                    Refresh
                  </Button>
                )}
              </Grid>
            </Hidden>
            <Hidden mdUp>
              <Grid item xs={12} align="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefreshClick}
                  style={{ color: "white", textTransform: "capitalize" }}
                >
                  Refresh
                </Button>
              </Grid>
            </Hidden>
            {props.wallOfFameData.map((item) => {
              return (
                <Grid item md={12} style={{ width: "100vw" }}>
                  <Card className={classes.WallOfFameroot}>
                    <CardContent style={{ paddingBottom: "0px" }}>
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        //spacing={item.type === "text" ? 1 : 1}
                        spacing={2}
                      >
                        <Grid item xs={12}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Avatar alt="Remy Sharp" src={item.user_image} />
                            </Grid>
                            <Grid item>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                              >
                                {item.user_name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        {(item.content.match(
                          /(?:<img[^>]+src=")(?<src>[^"]+)/
                        ) ||
                          item.content.match(
                            /(?:<video[^>]+src=")(?<src>[^"]+)/
                          )) &&
                        (item.type === "image" || item.type === "video") ? (
                          <CarouselCustom item={item} />
                        ) : (
                          <>
                            <Grid
                              item
                              xs={12}
                              dangerouslySetInnerHTML={
                                item.type === "image"
                                  ? {
                                      __html: item.content.replace(
                                        "<p><img",
                                        `<p style="margin:0;"><img width="100%"`
                                      ),
                                    }
                                  : {
                                      __html: item.content.replace(
                                        "<p>",
                                        `<p style="margin:0;">`
                                      ),
                                    }
                              }
                            />

                            {item.type === "text" && item.answer && (
                              <Grid item xs={12}>
                                <fieldset
                                  style={{
                                    border: "1px solid grey",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <legend
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    ANSWER
                                  </legend>
                                  <span>{item.answer}</span>
                                </fieldset>
                              </Grid>
                            )}

                            {/* {item.type === "image" && ( */}
                            {item.type === "image" &&
                              /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(
                                item.answer
                              ) && (
                                <Grid
                                  item
                                  //xs={6}
                                  xs={12}
                                  style={{
                                    width: "100%",
                                    textAlign: "center",
                                    lineHeight: "35px",
                                  }}
                                >
                                  <img
                                    //style={matches?{ width: "100%", height: "auto" }:{}}
                                    style={{
                                      maxWidth: "100%",
                                      //width: "100%",
                                      //height: 340,
                                    }}
                                    src={
                                      //"https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
                                      `${item.answer}`
                                      //"https://picsum.photos/400"
                                    }
                                    alt="404 | COULDN'T LOAD IMG"
                                  />
                                </Grid>
                              )}

                            {/* {item.type === "video" && ( */}
                            {item.type === "image" &&
                              /\.(mkv|mov|webm|mp4)$/i.test(item.answer) && (
                                <video src={item.answer} controls>
                                  Your browser does not support the video
                                  playback.
                                </video>
                              )}

                            {/^\d+\.$/.test(item.answer) && (
                              <video
                                src={item.answer}
                                controls
                                type="video/mp4"
                              >
                                Your browser does not support the video
                                playback.
                              </video>
                            )}
                          </>
                        )}

                        <Grid item xs={12} style={{ paddingBottom: "15px" }}>
                          <Grid container spacing={1} alignItems="center">
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
                                {item.points} points
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container alignItems="center"></Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            {props.allWallOfFameData?.UserAttempt?.next_page_url && (
              <Grid item xs={12} align="center">
                <Button
                  style={{
                    background: "rgb(254, 115, 0)",
                    color: "white",
                    marginTop: "40px",
                    marginBottom: "40px",
                    textTransform: "initial",
                    borderRadius: "8px",
                  }}
                  variant="contained"
                  onClick={handlePaginationClick}
                >
                  Load more
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
            )}
          </Grid>
        </div>
      )}
    </>
  );
};

export default WallOfFame;
