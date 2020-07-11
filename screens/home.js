import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPerm: null,
      type: Camera.Constants.Type.back,
      flash: Camera.Constants.FlashMode.off,
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasPerm: status === "granted",
    });
  }

  takePic = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.props.navigation.navigate("ViewImage", { photo: photo });
    }
  };

  flipCam = () => {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  flashOn = () => {
    this.setState({
      flash:
        this.state.flash === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off,
    });
  };

  render() {
    const { hasPerm } = this.state;

    if (hasPerm === null) {
      return <View />;
    } else if (hasPerm === false) {
      return (
        <View>
          {" "}
          <Text> We need camera permissions to work our magic!</Text>{" "}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            flashMode={this.state.flash}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.takePic()}
              >
                <FontAwesome name="circle" size={35} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.flipCam()}
              >
                <FontAwesome name="camera" size={35} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.flashOn()}
              >
                <FontAwesome name="flash" size={35} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  btn: {
    alignItems: "center",
    alignSelf: "flex-end",
    flex: 1,
  },
  icon: {
    marginBottom: 20,
    color: "white",
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
});
