import { Button } from "@mui/material";

import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "..";
import loggedInUserAtom from "../recoil/loggedInUserAtom";

const Lobby = ({ socket }) => {
  const navigate = useNavigate();
  const loggedInUser = useRecoilValue(loggedInUserAtom);

  const [chessGames, setChessGames] = useState([]);

  console.log(socket);

  useEffect(() => {
    if (socket) {
      socket.on("chessGamesUpdate", (chessGamesUpdate) => {
        const { updatedChessGames } = chessGamesUpdate;
        setChessGames(updatedChessGames);
      });

      socket.emit("enteredLobby");
    }

    const fetchChessGames = async () => {
      const res = await axios.get(`${API_BASE_URL}/chessGames`);
      const { initChessGames } = res.data;
      setChessGames(initChessGames);
    };

    fetchChessGames();

    return () => {
      if (socket) {
        socket.emit("leftLobby");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (loggedInUser) {
      const gamesThatHaveStarted = chessGames.filter(
        (chessGame) => chessGame.state === "in process"
      );

      const firstActiveGameForLoggedInUser = gamesThatHaveStarted.find(
        (chessGame) => {
          const isCreator =
            chessGame.creator.username === loggedInUser.username;
          const isOpponent =
            chessGame.opponent.username === loggedInUser.username;

          return isCreator || isOpponent;
        }
      );

      if (firstActiveGameForLoggedInUser) {
        navigate(`/chessgame/${firstActiveGameForLoggedInUser.id}`);
      }
    }
  }, [chessGames]);

  return (
    <div className="w-full flex flex-col items-center">
      <h2>Lobby</h2>
      <div className="w-full shadow-lg bg-white px-10 py-9 flex flex-col gap-y-3 ">
        {chessGames.map((game) => {
          const creatorName =
            loggedInUser && game.creator?.username === loggedInUser?.username
              ? "You"
              : game.creator?.username;

          const opponentName =
            loggedInUser && game.opponent?.username === loggedInUser?.username
              ? "You"
              : game.opponent?.username;

          const isCreator = creatorName === "You";

          const opponentExist = !!opponentName;

          const gameHasStarted = game.state === "in process";

          const isCreatorComponent = (
            <>
              {opponentExist && !gameHasStarted && (
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "85px", ml: "-101px", mr: "16px" }}
                  onClick={() => {
                    socket.emit("startChessGame", {
                      usernameOfCreator: loggedInUser.username,
                      chessGameId: game.id,
                    });
                  }}
                >
                  Start
                </Button>
              )}

              {!gameHasStarted && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "85px" }}
                  onClick={() => {
                    socket.emit("removeChessGame", {
                      usernameOfRemover: loggedInUser.username,
                      chessGameId: game.id,
                    });
                  }}
                >
                  Delete
                </Button>
              )}
            </>
          );

          const isNotCreatorComponent = opponentExist ? (
            <div className="w-[85px]" />
          ) : (
            <Button
              variant="contained"
              sx={{ width: "85px" }}
              onClick={() => {
                socket.emit("joinChessGame", {
                  usernameOfOpponent: loggedInUser.username,
                  chessGameId: game.id,
                });
              }}
            >
              {loggedInUser ? "Join" : "Observe"}
            </Button>
          );

          return (
            <div
              key={game.id}
              className="w-full border border-slate-500 px-4 py-3 flex justify-between"
            >
              <div className="flex flex-col flex-[1]">
                <p className="font-semibold">Creator</p>
                <p>{creatorName}</p>
              </div>

              <div className="flex flex-col flex-[1]">
                <p className="font-semibold">Opponent</p>
                <p>{opponentExist ? opponentName : "-"}</p>
              </div>

              <div className="flex">
                {isCreator ? isCreatorComponent : isNotCreatorComponent}
              </div>
            </div>
          );
        })}

        {loggedInUser && (
          <Button
            variant="contained"
            sx={{ mt: 1, py: 1.5 }}
            onClick={() => {
              socket.emit("createChessGame", {
                username: loggedInUser.username,
              });
            }}
          >
            Create new game
          </Button>
        )}
      </div>
    </div>
  );
};

export default Lobby;
