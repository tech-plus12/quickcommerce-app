import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { CartProvider } from "./src/context/CartContext";



const App = () => {


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
