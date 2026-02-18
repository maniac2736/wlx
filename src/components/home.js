import React from "react";
import { useSelector } from "react-redux";
import BalanceCard from "../views/UserDashboard/BalanceCard";
import ActionButtons from "../views/UserDashboard/ActionButtons";
import ActivityList from "../views/UserDashboard/ActivityList";

const Home = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="container py-4">
        <BalanceCard />
        <ActionButtons />
        <ActivityList />
      </div>
    </div>
  );
};

export default Home;
