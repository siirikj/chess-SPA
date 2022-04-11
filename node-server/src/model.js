import ChessGame from "./models/chessGame.model.js";
import UserSession from "./models/userSession.model.js";

class Model {
  constructor() {
    this.chessGames = [];
    this.userSessions = [];

    this.io = null;
  }

  connectUserWithSession(sessionId, username) {
    const userSession = this.userSessions.find(
      (currentUserSession) => currentUserSession.sessionId === sessionId
    );

    userSession.addUserToSession(username);
  }

  disconnectUserWithSession(sessionId, username) {
    const userSession = this.userSessions.find(
      (currentUserSession) => currentUserSession.sessionId === sessionId
    );

    if (userSession) userSession.removeUserFromSession(username);
  }

  addUserSession(sessionId) {
    const userSession = new UserSession(sessionId);
    this.userSessions.push(userSession);
  }

  verifyIfSessionValid(sessionId) {
    const session = this.userSessions.find(
      (currentUserSession) => currentUserSession.sessionId === sessionId
    );

    const sessionValidUntil = session
      ? session.validUntil
      : new Date(new Date().getTime() - 50);

    if (new Date().getTime() > sessionValidUntil) {
      if (session) {
        console.log(`Num before = ${this.userSessions.length}`);
        this.removeUserSession(sessionId);
        console.log(`Num after = ${this.userSessions.length}`);
      }
      return false;
    }

    session.updateValidUntil();

    return true;
    // TODO: run function whenever interacting with backend
  }

  verifyUser(sessionId, username) {
    const userSession = this.userSessions.find((currentUserSession) => {
      const isCorrectSession = currentUserSession.sessionId === sessionId;
      const isCorrectUser = currentUserSession.user?.username === username;

      return isCorrectSession && isCorrectUser;
    });

    if (userSession) {
      return true;
    }
    return false;
  }

  getUserFromSessionId(sessionId) {
    const userSession = this.userSessions.find(
      (currentUserSession) => currentUserSession.sessionId === sessionId
    );
    return userSession?.user;
  }

  addChessGame(username) {
    const chessGame = new ChessGame(username);
    this.chessGames.push(chessGame);
  }

  getChessGameFromId(chessGameId) {
    return this.chessGames.find((chessGame) => chessGame.id === chessGameId);
  }

  joinChessGame(chessGameId, username) {
    const chessGame = this.getChessGameFromId(chessGameId);

    chessGame.addOpponent(username);
  }

  startChessGame(chessGameId, username) {
    const chessGame = this.getChessGameFromId(chessGameId);

    const isCreator = chessGame.creator.username === username;

    if (isCreator) {
      chessGame.startGame();
    }

    return isCreator;
  }

  surrenderChessGame(chessGameId, username) {
    const chessGame = this.getChessGameFromId(chessGameId);
    const usernameOfOtherPlayer = chessGame?.getUsernameOfOtherPlayer(username);
    chessGame?.addWinner(usernameOfOtherPlayer);

    const tempChessGames = this.chessGames.filter(
      (currentChessGame) => currentChessGame?.id !== chessGameId
    );

    this.chessGames = tempChessGames;

    return chessGame;
  }

  removeChessGame(chessGameId) {
    const tempChessGames = this.chessGames.filter(
      (chessGame) => chessGame?.id !== chessGameId
    );

    this.chessGames = tempChessGames;

    return tempChessGames;
  }

  updatePiecesLocation(chessGameId, newPiecesLocation) {
    const chessGame = this.getChessGameFromId(chessGameId);
    chessGame.piecesLocation = newPiecesLocation;

    const moveMadeWin = chessGame.checkIfVictory();

    if (!moveMadeWin) {
      chessGame.activeColor =
        chessGame.activeColor === "white" ? "black" : "white";
    }

    return [moveMadeWin, chessGame];
  }

  removeUserSession(sessionId) {
    const tempUserSessions = this.userSessions.filter(
      (userSession) => userSession.sessionId !== sessionId
    );
    this.userSessions = tempUserSessions;
  }

  init(io) {
    io.on("connection", (socket) => {
      const { session } = socket.handshake;
      session.socketID = socket.id;

      console.log(`\n--> User with sessionId ${socket.id} connected <--`);
      this.addUserSession(socket.id);
      console.log(this.userSessions);
      console.log(`--------------------------------------------------`);

      socket.on("disconnect", () => {
        console.log(`\n--> User with sessionId ${socket.id} disconnected <--`);
        this.removeUserSession(socket.id);
        console.log(this.userSessions);
        console.log(`--------------------------------------------------`);
      });

      socket.on("enteredLobby", () => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          console.log(
            `\n--> User with sessionId ${socket.id} joined the lobby <--`
          );
          socket.join("lobby");
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("leftLobby", () => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          console.log(
            `\n--> User with sessionId ${socket.id} left the lobby <--`
          );
          socket.leave("lobby");
        } else {
          socket.disconnect();
        }
      });

      socket.on("loginUser", (user) => {
        const { username } = user;

        console.log(
          `\n--> User "${username}" with sessionId "${socket.id}" logged in <--`
        );
        this.connectUserWithSession(socket.id, username);

        socket.emit("userGotLoggedIn", { username, sessionId: socket.id });
        console.log(this.userSessions);
        console.log(`--------------------------------------------------`);
      });

      socket.on("logoutUser", (user) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { username } = user;

          console.log(
            `\n--> User "${username}" with sessionId "${socket.id}" logged out <--`
          );
          this.disconnectUserWithSession(socket.id, username);
          console.log(this.userSessions);
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("createChessGame", (user) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { username } = user;

          const userIsVerified = this.verifyUser(socket.id, username);

          if (!userIsVerified) {
            console.log(
              `\n--> Couldn't verify user "${username}" with session-id "${socket.id}" <--`
            );
            return;
          }

          console.log(`\n--> User "${username}" created a game <--`);

          this.addChessGame(username);

          io.to("lobby").emit("chessGamesUpdate", {
            updatedChessGames: this.chessGames,
          });

          console.log(this.chessGames);
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("removeChessGame", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { usernameOfRemover, chessGameId } = args;

          const userIsVerified = this.verifyUser(socket.id, usernameOfRemover);

          if (!userIsVerified) {
            console.log(
              `\n--> Couldn't verify user "${usernameOfRemover}" with session-id "${socket.id}" <--`
            );
            return;
          }

          this.removeChessGame(chessGameId);

          console.log(
            `\n--> User "${usernameOfRemover}" removed game "${chessGameId}" <--`
          );

          io.to("lobby").emit("chessGamesUpdate", {
            updatedChessGames: this.chessGames,
          });

          console.log(this.chessGames);
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("joinChessGame", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { usernameOfOpponent, chessGameId } = args;

          const userIsVerified = this.verifyUser(socket.id, usernameOfOpponent);

          if (!userIsVerified) {
            console.log(
              `\n--> Couldn't verify user "${usernameOfOpponent}" with session-id "${socket.id}" <--`
            );
            return;
          }

          this.joinChessGame(chessGameId, usernameOfOpponent);

          console.log(
            `\n--> User "${usernameOfOpponent}" joined game "${chessGameId}" <--`
          );

          io.to("lobby").emit("chessGamesUpdate", {
            updatedChessGames: this.chessGames,
          });

          console.log(this.chessGames);
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("startChessGame", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { usernameOfCreator, chessGameId } = args;

          const userIsVerified = this.verifyUser(socket.id, usernameOfCreator);

          if (!userIsVerified) {
            console.log(
              `\n--> Couldn't verify user "${usernameOfCreator}" with session-id "${socket.id}" <--`
            );
            return;
          }

          const userIsCreator = this.startChessGame(
            chessGameId,
            usernameOfCreator
          );

          if (!userIsCreator) {
            if (!userIsVerified) {
              console.log(
                `\n--> Couldn't verify user "${usernameOfCreator}" as the creator of game "${chessGameId}" <--`
              );
              return;
            }
          }

          console.log(
            `\n--> User "${usernameOfCreator}" started game "${chessGameId}" <--`
          );

          io.to("lobby").emit("chessGamesUpdate", {
            updatedChessGames: this.chessGames,
          });

          console.log(this.chessGames);
          console.log(`--------------------------------------------------`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("enteredGame", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { chessGameId } = args;
          console.log(
            `User with session-id "${socket.id}" entered game "${chessGameId}"`
          );
          socket.join(`chessRoom#${chessGameId}`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("leftGame", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { chessGameId } = args;
          console.log(
            `User with session-id "${socket.id}" left game "${chessGameId}"`
          );
          socket.leave(`chessRoom#${chessGameId}`);
        } else {
          socket.disconnect();
        }
      });

      socket.on("updatePiecesLocation", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { chessGameId, newPiecesLocation } = args;

          const [moveMadeWin, updatedChessGameInfo] = this.updatePiecesLocation(
            chessGameId,
            newPiecesLocation
          );

          io.to(`chessRoom#${chessGameId}`).emit("chessGameInfoUpdate", {
            updatedChessGameInfo,
          });

          if (moveMadeWin) {
            setTimeout(() => {
              this.removeChessGame(chessGameId);

              io.to(`chessRoom#${chessGameId}`).emit("chessGameInfoUpdate", {
                updatedChessGameInfo: "deleted",
              });
            }, 3000);
          }
        } else {
          socket.disconnect();
        }
      });

      socket.on("surrender", (args) => {
        const validSession = this.verifyIfSessionValid(socket.id);

        if (validSession) {
          const { chessGameId } = args;

          console.log(
            `User with session-id "${socket.id}" surrendered game "${chessGameId}"`
          );

          const user = this.getUserFromSessionId(socket.id);

          const finalChessGameInfo = this.surrenderChessGame(
            chessGameId,
            user?.username
          );

          io.to(`chessRoom#${chessGameId}`).emit("chessGameInfoUpdate", {
            updatedChessGameInfo: finalChessGameInfo,
          });
        } else {
          socket.disconnect();
        }
      });

      session.save((err) => {
        if (err) console.error(err);
      });
    });

    this.io = io;
  }
}

export default new Model();
