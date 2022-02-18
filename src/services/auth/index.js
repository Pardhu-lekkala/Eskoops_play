import agent from "../network/agent";
import ReactGA from "react-ga";

import toast from "react-hot-toast";
import MuiAlert from "@material-ui/lab/Alert";

import { Mixpanel } from "../../utils/MixPanel";

const errorToast = () => {
  toast.custom((t) => (
    <MuiAlert
      onClose={() => toast.dismiss(t.id)}
      elevation={6}
      variant="filled"
      severity="error"
    >
      {`It's not you. It's us. Give it another try, please`}
    </MuiAlert>
  ));
};

const login = (loginData) => {
  return agent.Auth.login(loginData)
    .then((data) => {
      console.clear();
      console.log(data);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("first_name", data.response.first_name);
      localStorage.setItem("image", data.response.image);
      localStorage.setItem("userProfile", JSON.stringify(data.response));
      // localStorage.setItem('refresh', data.user.refresh);  //replace this
      // agent.setToken(data.user.token);
      // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xNS4yMDcuMTI5LjExNlwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYyMjYxNTg4NiwiZXhwIjoxNjI0MTI3ODg2LCJuYmYiOjE2MjI2MTU4ODYsImp0aSI6Im82TFBWVGFhTXUyWTJ2MlAiLCJzdWIiOjMyOCwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.G-IMF44dKMfCyNZCC8y_MYSQR_PeZQn-nh86F4w0s7Q
      ReactGA.event({
        category: "User",
        action: "User Logged In",
      });

      Mixpanel.identify(data.response.first_name);
      Mixpanel.track("Successful login", { data: data.response });
      Mixpanel.people.set({
        $first_name: data.response.first_name,
        $email: data.response?.email,
      });

      return { status: true, data };
    })
    .catch((err) => {
      console.log(err);
      Mixpanel.track("Unsuccessful login", { err: err.response });

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data: err.response.body,
        errors: err.response.body,
      };
    });
};

const accessCode = (accessCode) => {
  return agent.Auth.accessCode(accessCode)
    .then((data) => {
      localStorage.setItem("game_id", data.game_id);
      localStorage.setItem("access_code", accessCode);
      localStorage.setItem("game_image", data.image_url ? data.image_url : "");
      // localStorage.setItem('refresh', data.user.refresh);
      // agent.setToken(data.user.token);
      Mixpanel.track("Access Code API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });
      ReactGA.event({
        category: "User",
        action: "User Logged In",
      });

      return { status: true, data };
    })
    .catch((err) => {
      console.log(err);
      Mixpanel.track("accessCode", {
        data: err,
        statusCode: err?.response?.statusCode,
      });

      err.response.statusCode === 429 && errorToast();

      return {
        status: false,
        errors: err,
        statusCode: err.response.statusCode,
      };
    });
};

const password = (accessCode, game_id, password) => {
  return agent.Auth.password(accessCode, game_id, password)
    .then((data) => {
      // localStorage.setItem("game_id", data.game_id);
      // localStorage.setItem('refresh', data.user.refresh);
      // agent.setToken(data.user.token);
      Mixpanel.track("Password API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });
      ReactGA.event({
        category: "User",
        action: "User Logged In",
      });

      return { status: true, data };
    })
    .catch((err) => {
      console.log(err);
      Mixpanel.track("password", {
        data: err,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        errors: err,
      };
    });
};

/* ********************************************************************************************************* */
const getChallengesIdsPAGINATION = (gameid) => {
  return agent.Auth.getchallenges(gameid)
    .then(async (data) => {
      const challenge_ids = data.challenges.map((item) => {
        return item.id;
      });
      const challenge_status = data.challenges.map((item) => {
        return item.challenge_submitted;
      });

      Mixpanel.track("getChallengesIds API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: true, data, challenge_ids, challenge_status };
    })
    .catch((err) => {
      console.log("unable to store profile", err.response.body);
      Mixpanel.track("getChallengesIds", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        err: err.response.body,
      };
    });
};

const getChallengesPAGINATION = async (gameid, challenge_ids) => {
  let array = [];
  for (let i = 0; i < challenge_ids.length; i++) {
    try {
      let res = await getIndividualChallenges(gameid, challenge_ids[i]);
      array.push(res);
    } catch (error) {
      console.log("error", error); //return { status: false };
    }
  }
  return { status: true, array };
};
/* ************************************************************************************************************* */

const getChallenges = (gameid) => {
  return agent.Auth.getchallenges(gameid)
    .then(async (data) => {
      const challenge_ids = data.challenges.map((item) => {
        return item.id;
      });
      const challenge_status = data.challenges.map((item) => {
        return item.challenge_submitted;
      });
      let array = [];
      for (let i = 0; i < challenge_ids.length; i++) {
        try {
          let res = await getIndividualChallenges(gameid, challenge_ids[i]);
          array.push(res);
        } catch (error) {
          console.log("error", error);
        }
      }
      Mixpanel.track("getChallenges API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: true, data, array, challenge_status };
    })
    .catch((err) => {
      console.log("unable to store profile", err);
      Mixpanel.track("getChallenges", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        err: err.response.body,
      };
    });
};

const getIndividualChallenges = async (gameid, challengeid) => {
  let res = await agent.Auth.getIndividualChallenges(gameid, challengeid);
  return res.challenges;
};

const getWallOfFame = (gameid, page) => {
  return agent.Auth.getWallOfFame(gameid, page)
    .then((data) => {
      // localStorage.setItem('profile', JSON.stringify(data));

      Mixpanel.track("getWallOfFame API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: true, data };
    })
    .catch((err) => {
      // console.log('unable to store profile', err.response);
      Mixpanel.track("getWallOfFame API", {
        data: err.response,
        statusCode: err?.response?.statusCode,
        first_name: localStorage.getItem("first_name"),
      });
      var data = [];
      if (err.response != undefined) {
        data = err.response.body;
      }

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data,
        err: err.response.body,
      };
    });
};

const submitAnswer = (response, challenge_id, game_id) => {
  return agent.Auth.submitAnswer(response, challenge_id, game_id)
    .then((data) => {
      const correct_type = data.correct_type;
      const correct_content = data.correct_content;
      const in_correct_content = data.in_correct_content;
      // localStorage.setItem('profile', JSON.stringify(data));

      Mixpanel.track("submitAnswer API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return {
        status: true,
        data,
        correct_type,
        correct_content,
        in_correct_content,
      };
    })
    .catch((err) => {
      // console.log('unable to store profile', err.response);
      Mixpanel.track("submitAnswer", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      var data = [];
      if (err.response != undefined) {
        data = err.response.body;
      }
      const correct_type = data.correct_type;
      const correct_content = data.correct_content;
      const in_correct_content = data.in_correct_content;

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data,
        correct_type,
        correct_content,
        in_correct_content,
      };
    });
};

const submitImageAnswer = (response, challenge_id, game_id) => {
  const formData = new FormData();
  formData.append("game_id", game_id);
  formData.append("challenge_id", challenge_id);
  formData.append("file", response);
  return agent.Auth.submitImageAnswer(formData)
    .then((data) => {
      const correct_type = data.correct_type;
      const correct_content = data.correct_content;
      const in_correct_content = data.in_correct_content;
      // localStorage.setItem('profile', JSON.stringify(data));

      Mixpanel.track("submitImageAnswer API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return {
        status: data.status,
        data,
        correct_type,
        correct_content,
        in_correct_content,
      };
    })
    .catch((err) => {
      // console.log('unable to store profile', err.response);
      Mixpanel.track("submitImageAnswer", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      const correct_type = data.correct_type;
      const correct_content = data.correct_content;
      const in_correct_content = data.in_correct_content;
      var data = [];
      if (err.response != undefined) {
        data = err.response.body;
      }

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data,
        correct_type,
        in_correct_content,
        correct_content,
      };
    });
};

const getLeaderboard = (gameid) => {
  return agent.Auth.getLeaderboard(gameid)
    .then((data) => {
      // localStorage.setItem('profile', JSON.stringify(data));

      Mixpanel.track("getLeaderboard API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: true, data };
    })
    .catch((err) => {
      Mixpanel.track("getLeaderboard API", {
        data: err.response,
        statusCode: err?.response?.statusCode,
        first_name: localStorage.getItem("first_name"),
      });
      // console.log('unable to store profile', err.response.body);
      var data = [];
      if (err.response != undefined) {
        data = err.response.body;
      }

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data,
        err: err.response.body,
      };
    });
};

const leaderboardTeamDetails = (game_id, team_id, rank) => {
  return agent.Auth.leaderboardTeamDetails({ game_id, team_id, rank })
    .then((data) => {
      Mixpanel.track("leaderboardTeamDetails API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: true, data };
    })
    .catch((err) => {
      Mixpanel.track("leaderboardTeamDetails", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      // console.log('unable to store profile', err.response.body);
      var data = [];
      if (err.response != undefined) {
        data = err.response.body;
      }

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        data,
        err: err.response.body,
      };
    });
};

const register = (registerData) => {
  const formData = new FormData();
  let d = Object.keys(registerData).map((item) => {
    formData.append(item, registerData[item]);
  });
  return agent.Auth.register(formData)
    .then((data) => {
      if (data.status === "false") {
        throw data;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("first_name", data.response.first_name);
      localStorage.setItem("image", data.response.image);
      localStorage.setItem("userProfile", JSON.stringify(data.response));
      // localStorage.setItem('token', data.user.token);
      // localStorage.setItem('refresh', data.user.refresh);
      // agent.setToken(data.user.token);
      localStorage.setItem("first_name", data.response.first_name);

      Mixpanel.track("register API", {
        data: data,
        first_name: data.response.first_name,
      });

      ReactGA.event({
        category: "User",
        action: "User Logged In",
      });

      return { status: data.status, message: data.message };
    })
    .catch((err) => {
      Mixpanel.track("register", {
        data: err.response,
        statusCode: err?.response?.statusCode,
      });

      console.log(err);

      err?.response?.statusCode === 429 && errorToast();

      return {
        statusCode: err?.response?.statusCode,
        status: false,
        errors: err,
      };
    });
};

const editProfile = (registerData) => {
  const formData = new FormData();
  let d = Object.keys(registerData).map((item) => {
    formData.append(item, registerData[item]);
  });
  //console.log("registerData", registerData);
  return agent.Auth.editProfile(formData)
    .then((data) => {
      localStorage.setItem("first_name", registerData.name);
      localStorage.setItem("image", registerData.image);

      Mixpanel.track("editProfile API", {
        data: data,
        first_name: registerData.name,
      });

      return { status: data.status, message: data.message };
    })
    .catch((err) => {
      Mixpanel.track("editProfile", {
        data: err.response,
        statusCode: err?.response?.statusCode,
      });
      console.log(err);

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        errors: err,
      };
    });
};

const updateTeamDetails = (updateData) => {
  const formData = new FormData();
  let d = Object.keys(updateData).map((item) => {
    formData.append(item, updateData[item]);
  });
  //console.log("registerData", updateData);
  return agent.Auth.updateTeamDetails(formData)
    .then((data) => {
      Mixpanel.track("updateTeamDetails API", {
        data: data,
        first_name: localStorage.getItem("first_name"),
      });

      return { status: data.status, message: data.message };
    })
    .catch((err) => {
      Mixpanel.track("updateTeamDetails", {
        data: err.response,
        first_name: localStorage.getItem("first_name"),
        statusCode: err?.response?.statusCode,
      });
      console.log(err);

      err.response.statusCode === 429 && errorToast();

      return {
        statusCode: err.response.statusCode,
        status: false,
        errors: err,
      };
    });
};

const isLoggedIn = () => {
  const isLogged =
    localStorage.getItem("token") !== null &&
    localStorage.getItem("token") !== "undefined";
  return isLogged;
};

export default {
  isLoggedIn,
  register,
  login,
  accessCode,
  getChallenges,
  getWallOfFame,
  getLeaderboard,
  submitAnswer,
  getChallengesPAGINATION,
  getChallengesIdsPAGINATION,
  submitImageAnswer,
  password,
  leaderboardTeamDetails,
  editProfile,
  updateTeamDetails,
};
