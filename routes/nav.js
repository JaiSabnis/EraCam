import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/home";
import ViewImage from "../screens/view";

const nav = createSwitchNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: "",
      },
    },
    ViewImage: { screen: ViewImage },
  },
  {
    defaultNavigationOptions: {
      headerTintColor: "orange",
      headerStyle: { backgroundColor: "black" },
    },
  }
);
const AppNav = createAppContainer(nav);
export default AppNav;
