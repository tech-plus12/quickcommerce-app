import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { CartProvider } from "./src/context/CartContext";
import { useEffect } from "react";
import Config from "react-native-config";

const apiUrl = Config.API_URL;

const App = () => {
  useEffect(() => {
    console.log(`API URL is ${apiUrl}`);
    fetch("http://192.168.1.18:3001/api/test")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
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
