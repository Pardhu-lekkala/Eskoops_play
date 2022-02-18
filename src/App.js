import Router from "./routers";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Toaster } from "react-hot-toast";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FE7300",
      //main: "rgba(112,225,245,1)",
      //orange: "rgba(255,136,0,1)",
    },
  },
  typography: {
    fontFamily: ['"Montserrat"'].join(","),
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Router />
        <Toaster position="bottom-center" />
      </DndProvider>
    </MuiThemeProvider>
  );
}

export default App;
