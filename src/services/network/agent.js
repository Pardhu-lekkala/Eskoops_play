import superagent from "./index";
import axios from "axios";

// const API_ROOT = "http://15.207.129.116/api/";
const API_ROOT = "https://eskoops.com/api/";
//const API_ROOT = "http://165.22.214.9/dev2/skoopweb/public/api/";

const encode = encodeURIComponent;
const responseBody = (res) => {
  return res.body;
};

const errorBody = (err) => {
  if (err) {
    console.table({
      result: "error",
      status: err.status,
      // body: JSON.stringify(err.response.body),
    });
    //console.log(err.response);
    //return err;
  }
};

const tokenPlugin = (req) => {
  let token = localStorage.getItem("token");
  if (token) {
    req.set("authorization", `Bearer ${token}`);
  }
  //console.log("request:", req.url);
};

const requests = {
  del: (url) =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
  get: (url) =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
  postAxios: (url, body) =>
    axios({
      method: "post",
      url: `${API_ROOT}${url}`,
      data: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenPlugin,
      },
    }).then(responseBody),
  patch: (url, body) =>
    superagent
      .patch(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
  getWithQuery: (url, query) =>
    superagent
      .get(`${API_ROOT}${url}`)
      .query(query)
      .use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody),
};

const Auth = {
  accessCode: (accessCode) =>
    requests.post("auth/access_code", { access_code: accessCode }),
  password: (accessCode, game_id, password) =>
    requests.post("auth/access_code", {
      access_code: accessCode,
      access_password: password,
      id: game_id,
    }),

  register: (formData) => requests.post("auth/register", formData),
  editProfile: (formData) => requests.post("auth/update_profile", formData),
  updateTeamDetails: (formData) => requests.post("auth/team_update", formData),

  login: (loginData) =>
    requests.post("auth/login", {
      email: loginData.email,
      password: loginData.password,
    }),
  getchallenges: (gameid) =>
    requests.post("auth/challenges", {
      game_id: gameid,
    }),
  getWallOfFame: (gameid, page) =>
    requests.post(`auth/post_wall${page}`, {
      game_id: gameid,
    }),
  getLeaderboard: (gameid) =>
    requests.post("auth/leaderboard_teams", {
      game_id: gameid,
    }),
  getIndividualChallenges: (gameid, challengeid) =>
    requests.post("auth/challenge_detail", {
      game_id: gameid,
      challenge_id: challengeid,
    }),
  submitAnswer: (response, challenge_id, game_id) =>
    requests.post("auth/challenge_detail_submit", {
      response: response,
      challenge_id: challenge_id,
      game_id: game_id,
    }),
  submitImageAnswer: (formData) =>
    requests.post("auth/challenge_detail_image_submit", formData),
  /* submitImageAnswer: (formData) =>
    superagent
      .post(`${"http://localhost:7000/api/upload"}`, formData)
      //.use(tokenPlugin)
      .on("error", errorBody)
      .then(responseBody), */
  leaderboardTeamDetails: (formData) =>
    requests.post("auth/leaderboard_team_detail", formData),
};

export default {
  Auth,
};
