import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { API_BASE_URL } from "..";
import ChessBoard from "../components/ChessBoard";
import loggedInUserAtom from "../recoil/loggedInUserAtom";
import { initSelectedSquare, piecesUnicodes } from "../utils/chess/chessPieces";

const ChessGameTemp = ({ socket }) => {
  const params = useParams();
  const loggedInUser = useRecoilValue(loggedInUserAtom);

  const [gameInfo, setGameInfo] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(initSelectedSquare);

  const [currentPlayerInfo, setCurrentPlayerInfo] = useState(null);

  // TODO: Änvänd ES-linting
  // TODO: Kolla så att alla endpoints med känslig data verkligen är säkra

  useEffect(() => {
    const fetchChessGameInfo = async () => {
      const res = await axios.get(
        `${API_BASE_URL}/chessGames/${params.chessGameId}`
      );
      const { initChessGameInfo } = res.data;
      setGameInfo(initChessGameInfo);
    };

    fetchChessGameInfo();

    socket.on("chessGameInfoUpdate", (args) => {
      const { updatedChessGameInfo } = args;
      setGameInfo(updatedChessGameInfo);
    });

    socket.emit("enteredGame", { chessGameId: params.chessGameId });

    return () => socket.emit("leftGame", { chessGameId: params.chessGameId });
  }, [socket]);

  useEffect(() => {
    if (gameInfo) {
      const isCreator = gameInfo.creator.username === loggedInUser?.username;
      const isOpponent = gameInfo.opponent.username === loggedInUser?.username;

      const isPlayer = isCreator || isOpponent;

      let tempCurrentPlayerInfo = null;

      if (isPlayer) {
        const username = loggedInUser?.username;
        const color =
          gameInfo.whitePlayer.username === loggedInUser?.username
            ? "white"
            : "black";
        const isActivePlayer = gameInfo.activeColor === color;
        const wonGame = gameInfo.winner?.username === username;

        tempCurrentPlayerInfo = {
          username,
          color,
          isActivePlayer,
          isCreator,
          isOpponent,
          isPlayer,
          wonGame,
        };

        setCurrentPlayerInfo(tempCurrentPlayerInfo);
      }
    }
  }, [gameInfo]);

  if (!gameInfo) return <CircularProgress size={60} />;

  // if (gameInfo === 'deleted') {
  // 	navigate('/lobby')
  // }

  const setPiecesLocationHandler = (newPiecesLocation) => {
    const chessGameId = gameInfo.id;

    socket.emit("updatePiecesLocation", { chessGameId, newPiecesLocation });
  };

  const setSelectedSquareHandler = (newSelectedSquare) => {
    // if (currentPlayerInfo.isActivePlayer) {
    if (currentPlayerInfo.isActivePlayer) {
      setSelectedSquare(newSelectedSquare);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-3">
      {gameInfo.state === "finnished" && (
        <h2>
          {gameInfo.winner.username} won!!! {gameInfo.looser.username} lost :((
        </h2>
      )}

      {<p>Black player: {gameInfo.blackPlayer.username}</p>}
      <ChessBoard
        piecesLocation={gameInfo.piecesLocation}
        setPiecesLocation={setPiecesLocationHandler}
        piecesUnicodes={piecesUnicodes}
        activePlayer={gameInfo.activeColor}
        selectedSquare={selectedSquare}
        setSelectedSquare={setSelectedSquareHandler}
        winner={gameInfo.winner?.username}
      />
      {<p>White player: {gameInfo.whitePlayer.username}</p>}

      {currentPlayerInfo?.isPlayer && gameInfo.state !== "finnished" && (
        <div className="flex gap-x-3">
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              socket.emit("surrender", { chessGameId: params.chessGameId });
            }}
          >
            Surrender
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChessGameTemp;
