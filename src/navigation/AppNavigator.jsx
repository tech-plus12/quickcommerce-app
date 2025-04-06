import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkToken, logout } from "../store/authSlice";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigator from "./DrawerNavigator";
import OnboardingScreen from "../screens/OnboardingScreen";
import PromiseReportScreen from "../screens/PromiseReportScreen";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const user = useSelector((state) => state.auth.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {

        const token = await AsyncStorage.getItem("token");


        if (token) {

          try {
            const result = await dispatch(checkToken()).unwrap();


            if (!result.isValid || !result.user?.company_id) {

              await AsyncStorage.removeItem("token");
              dispatch(logout());
            } else {

            }
          } catch (error) {
            await AsyncStorage.removeItem("token");
            dispatch(logout());
          }
        } else {

          dispatch(logout());
        }
      } catch (error) {
        await AsyncStorage.removeItem("token");
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Verifying authentication...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5B37B7",
    fontWeight: "500",
  },
});

export default AppNavigator;
