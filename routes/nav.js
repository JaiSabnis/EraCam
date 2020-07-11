import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/home";
import ViewImage from "../screens/view";

const screens = {
  Home: { screen: Home },
  ViewImage: { screen: ViewImage },
};

const nav = createStackNavigator(screens);
const AppNav = createAppContainer(nav);
export default AppNav;
