import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { API_BASE_URL } from "../index";
import loggedInUserAtom from "../recoil/loggedInUserAtom";

const Profile = () => {
  const navigate = useNavigate();

  const loggedInUser = useRecoilValue(loggedInUserAtom);

  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedInUser) {
        const res = await axios.get(`${API_BASE_URL}/me`, {
          params: {
            username: loggedInUser.username,
            sessionId: loggedInUser.sessionId,
          },
        });

        const { GamesWon, GamesLost, GamesPlayed } = res.data.info;

        setUserStats({
          GamesWon,
          GamesLost,
          GamesPlayed,
        });
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!loggedInUser) navigate("/login");
  }, [loggedInUser]);

  if (!loggedInUser || !userStats) return null;

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {loggedInUser?.username}</p>
      <div className="flex flex-col">
        <p className="font-bold">Stats</p>
        <div className="flex gap-x-3">
          <p>Games won: {userStats.GamesWon}</p>
          <p>Games lost: {userStats.GamesLost}</p>
          <p>Games played: {userStats.GamesPlayed}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
