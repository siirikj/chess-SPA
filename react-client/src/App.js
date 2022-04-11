import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import io from "socket.io-client";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Navigation from "./components/Navigation";
import ChessGame from "./pages/ChessGame";

import loggedInUserAtom from "./recoil/loggedInUserAtom";

const socket = io.connect("http://localhost:8989");

const App = () => {
  const setLoggedInUser = useSetRecoilState(loggedInUserAtom);

  useEffect(() => {
    socket.on("userGotLoggedIn", (args) => {
      const { username, sessionId } = args;

      setLoggedInUser({
        username,
        sessionId,
      });
    });

    return () => socket.disconnect();
  }, []);

  const connected = socket?.connected || true;

  const lobbyComponent = connected ? (
    <Lobby socket={socket} />
  ) : (
    <div className="w-full flex justify-center mt-3">
      <CircularProgress size={60} />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navigation socket={socket} />}>
          <Route path="/" element={<Lobby />} />
          <Route path="lobby" element={lobbyComponent} />
          <Route path="login" element={<Login socket={socket} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="chessGame" element={<ChessGame />} />

          <Route
            path="chessGame/:chessGameId"
            element={<ChessGame socket={socket} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
