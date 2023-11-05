import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { routesPublic, routesPrivate } from "./routes";
import RequireAuthentication from "./components/require-auth";

function App() {
  return (
    <Box className="App">
      <Routes>
        {routesPublic?.map((route) => {
          return (
            <Route
              path={route.path}
              element={route.component}
              key={route.path}
            />
          );
        })}
        {routesPrivate?.map((route) => {
          return (
            <Route
              path={route.path}
              element={
                <RequireAuthentication>{route.component}</RequireAuthentication>
              }
              key={route.path}
            />
          );
        })}
      </Routes>
    </Box>
  );
}

export default App;
