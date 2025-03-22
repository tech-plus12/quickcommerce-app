import React from "react";
import { Button } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      title="Logout"
      onPress={() => {
        dispatch(logout());
      }}
    />
  );
};

export default LogoutButton;
