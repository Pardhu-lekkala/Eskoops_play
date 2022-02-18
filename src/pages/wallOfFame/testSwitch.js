import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Carousel from "react-material-ui-carousel";

//import answer from "../../static/images/answer.png";

/* import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

const CustomSwitch = withStyles({
  switchBase: {
    color: "#FE7300",
    "&$checked": {
      color: "#FE7300",
    },
    "&$checked + $track": {
      backgroundColor: "#FE7300",
    },
  },
  checked: {},
  track: { backgroundColor: "#FE7300" },
})(Switch); */

export default function CustomizedSwitches({ item }) {
  const [state, setState] = React.useState(0);

  /*   const handleChange = (event) => {
    setState(event.target.checked ? 1 : 0);
  }; */

  return (
    <>
      <Grid item xs={12}>
        <Carousel
          autoPlay={false}
          index={state}
          indicators={false}
          next={(next, active) => setState(next)}
          prev={(prev, active) => setState(prev)}
        >
          <div
            style={{
              textAlign: "center",
              lineHeight: "75px",
            }}
          >
            {item.type === "image" &&
            /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(item.answer) ? (
              <Grid justify="center">
                <img
                  style={{
                    width: "100%",
                    //height: "auto",
                    //height: "450px",
                  }}
                  src={`${item.answer}`}
                  alt="404 | COULDN'T LOAD IMG"
                />
                {/*  <div
                  style={{
                    position: "absolute",
                    bottom: "68px",
                    //left: "8px",
                  }}
                >
                  <img src={answer} alt="answer" />
                </div> */}
              </Grid>
            ) : (
              <>
                <video
                  src={item.answer}
                  controls
                  //type="video/mp4"
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "contain",
                    //objectPosition: "center",
                    //transform: "scale(-1, 1)",
                  }}
                >
                  Your browser does not support the video playback.
                </video>
                {/* <div
                  style={{
                    position: "absolute",
                    bottom: "78px",
                    //left: "8px",
                  }}
                >
                  <img src={answer} alt="answer" />
                </div> */}
              </>
            )}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: item.content.replace("<p>", `<p style="margin:0;">`),
            }}
          ></div>
        </Carousel>
      </Grid>
      <Grid item>
        <Button
          size="small"
          onClick={() => setState(0)}
          color={Boolean(state) ? "default" : "primary"}
          variant={Boolean(state) ? "contained" : "contained"}
          style={
            Boolean(state)
              ? { textTransform: "none", fontWeight: "200" }
              : { textTransform: "none", color: "white", fontWeight: "200" }
          }
        >
          {`Answer`}
        </Button>
        <Button
          size="small"
          color={Boolean(state) ? "primary" : "default"}
          variant={Boolean(state) ? "contained" : "contained"}
          onClick={() => setState(1)}
          style={
            Boolean(state)
              ? {
                  textTransform: "none",
                  color: "white",
                  marginLeft: "10px",
                  fontWeight: "200",
                }
              : { textTransform: "none", marginLeft: "10px", fontWeight: "200" }
          }
        >
          Challenge
        </Button>
        {/* <Typography
          style={
            Boolean(state)
              ? { display: "inline-block" }
              : { color: "#FE7300", display: "inline-block" }
          }
        >
          Answer
        </Typography>
        <CustomSwitch
          //color="primary"
          checked={Boolean(state)}
          onChange={handleChange}
        />
        <Typography
          style={
            Boolean(state)
              ? { color: "#FE7300", display: "inline-block" }
              : { display: "inline-block" }
          }
        >
          Question
        </Typography> */}
      </Grid>
    </>
  );
}
