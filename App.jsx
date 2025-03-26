import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { CartProvider } from "./src/context/CartContext";
import { useEffect, useState } from "react";
import Config from "react-native-config";
import socket from "./src/services/socket";

const apiUrl = Config.API_URL;

const App = () => {
  const [message, setMessage] = useState("Waiting for server...");

  useEffect(() => {
    socket.connect();
    socket.on("message", (data) => {
      setMessage(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(`API URL is ${apiUrl}`);
  }, []);

  return (
    <Provider store={store}>
      <CartProvider>
        <AppNavigator>
          <NavigationContainer>
            <DrawerNavigator />
          </NavigationContainer>
        </AppNavigator>
      </CartProvider>
    </Provider>
  );
};

export default App;
