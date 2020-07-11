import React from "react";
import { StyleSheet, View, Image } from "react-native";

export default class ViewImage extends React.Component {
  render() {
    let photo = this.props.navigation.getParam("photo", "empty");

    return (
      <View style={styles.container}>
        <Image
          style={{ width: "100%", height: "100%" }}
          source={photo === "empty" ? require("../assets/icon.png") : photo}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
