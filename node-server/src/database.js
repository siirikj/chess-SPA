import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

sqlite3.verbose()

const databasePath = join(
	dirname(fileURLToPath(import.meta.url)),
	'.',
	'.',
	'db.sqlite'
)

// Open and initialize the database
export default await (async () => {
	const db = await open({
		filename: databasePath,
		driver: sqlite3.Database,
	})

	await db.run(
		`CREATE TABLE IF NOT EXISTS Users (
      UserID      TEXT   NOT NULL UNIQUE,
      Username    TEXT  NOT NULL  UNIQUE,
      Password    TEXT  NOT NULL,
      GamesPlayed int   DEFAULT 0,
      GamesLost   int   DEFAULT 0,
      GamesWon    int   DEFAULT 0,
      GamesDraw   int   DEFAULT 0,
      PRIMARY KEY (UserID)
    )`
	)

	await db.run(
		`CREATE TABLE IF NOT EXISTS Games (   
      GameID      TEXT  NOT NULL UNIQUE,
      CreatorID   TEXT   NOT NULL,
      OpponentID  TEXT,
      PRIMARY KEY   (GameID),
      FOREIGN KEY   (CreatorID)
              REFERENCES Users(UserID),
      FOREIGN KEY   (OpponentID)
              REFERENCES Users(UserID) 
    )`
	)

	return db
})()
