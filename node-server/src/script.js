import db from "./models/db.model.js";

const USERS = [
  {
    username: "rasmus",
    password: "hej123",
  },
  {
    username: "siri",
    password: "hej123",
  },
];

const addUsers = async () => {
  const [success1, info1] = await db.addUser("rasmus", "hej123");
  const [success2, info2] = await db.addUser("siri", "hej123");

  console.log(success1, info1);
  console.log(success2, info2);
};

const addGames = async () => {
  const [success1, info1] = await db.addGame("rasmus");
  const [success2, info2] = await db.addGame("siri");

  console.log(success1, info1);
  console.log(success2, info2);
};

const loginUsers = async () => {
  USERS.forEach(async (user) => {
    const correctPassword = await db.verifyPassword(
      user.username,
      user.password
    );

    if (correctPassword) {
      console.log(`User "${user.username}" successfully logged in! :)`);
    } else {
      console.log(`Wrong password for user "${user.username}"! :(`);
    }
  });
};

const main = async () => {
  // console.log('--- Add users ---')
  await addUsers();

  // console.log('\n--- Add games ---')
  await addGames();

  console.log("\n--- Login users ---");
  await loginUsers();
};

await main();
