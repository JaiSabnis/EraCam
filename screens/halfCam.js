import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Container,
  Header,
  Content,
  ListItem,
  CheckBox,
  Text,
  Body,
  Card,
  CardItem,
} from "native-base";

import { FontAwesome } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as FaceDetector from "expo-face-detector";
import Mask from "./mask";

const width = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const height = width * (4 / 3);
const topMargin = deviceHeight * 0.05;
const tipsHeight = (deviceHeight - height) / 1;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPerm: null,
      hasMedia: null,
      type: Camera.Constants.Type.back,
      flash: Camera.Constants.FlashMode.off,
      message: "",
      faces: [],
      messages: [
        { msg: "Try moving to the orange line", id: 1 },
        { msg: "test suggestion 1", id: 2 },
        { msg: "Try moving to the orange line", id: 3 },
        { msg: "Try moving to the yeloow line", id: 4 },
      ],
      displayMessages: [],
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { savePerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.setState({
      hasPerm: status === "granted",
      hasMedia: savePerm === "granted",
    });
  }

  takePic = async () => {
    if (this.camera) {
      const { uri } = await this.camera.takePictureAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);

      this.props.navigation.navigate("ViewImage", { photo: uri });
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
          : Camera.Constants.FlashMode.on,
    });
  };

  handleFacesDetected = ({ faces }) => {
    this.setState({ faces });

    var groupPic = false;
    var allSmiles = true;
    var shutEye = false;

    if (faces.length > 0) {
      groupPic = true;
    }

    // eyes shut

    if (groupPic) {
      for (i = 0; i < faces.length; i++) {
        if (
          faces[i].rightEyeOpenProbability < 0.6 ||
          faces[i].leftEyeOpenProbability < 0.5
        ) {
          shutEye = false;
        }
      }
      if (shutEye === false) {
        this.setState({ message: "" });
      } else {
        this.setState({ message: "You might be blinking" });
      }
    }

    // lighting

    // angles

    // face positioning

    // smiling
    /*
    for (i = 0; i < faces.length; i++) {
      if (faces[i].smilingProbability < 0.5) {
        allSmiles = false;
      }
    }
    if (allSmiles === true) {
      this.setState({ message: "" });
    } else {
      this.setState({ message: "Smiles light up a room! Say Cheese" });
    }
    */
  };

  render() {
    const { hasPerm, hasMedia } = this.state;

    if (hasPerm === null && hasMedia === null) {
      return <View />;
    } else if (hasPerm === false && hasMedia === false) {
      return (
        <View>
          {" "}
          <Text> We need camera permissions to work our magic!</Text>{" "}
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ratio="4:3"
            pictureSize="4:3"
            flashMode={this.state.flash}
            onFacesDetected={this.handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all,
              tracking: true,
            }}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View style={styles.row}></View>
            <View style={styles.row}></View>

            {/*
            {
              // For each face draw the mask
              faces.map((face) => (
                <Mask key={face.faceID} face={face} />
              ))
            }
          */}
            <View style={styles.card}>
              <CardItem>
                <Body>
                  <Text style={styles.message}>{this.state.message}</Text>
                </Body>
              </CardItem>
            </View>
          </Camera>

          {/*
          <ScrollView style={styles.tips}>
            {this.state.messages.map((item, index) => (
              <View style={styles.card} key={item.id}>
                <CardItem>
                  <Body>
                    <Text style={styles.message}>{item.msg}</Text>
                  </Body>
                </CardItem>
              </View>
            ))}
          </ScrollView>
            */}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={() => this.flipCam()}>
              <FontAwesome name="camera" size={35} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => this.takePic()}>
              <FontAwesome name="circle" size={40} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  orange: {
    color: "orange",
  },
  col: {
    height: height,
    width: width * (1 / 3),
    borderRightWidth: 1,
    borderRightColor: "white",
  },
  row: {
    height: height * (1 / 3),
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    zIndex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  icon: {
    marginBottom: 10,
    color: "white",
  },
  card: {
    width: width * 0.9,
    borderRadius: 30,
    alignSelf: "center",
    height: tipsHeight * 0.2,
    borderWidth: 0.5,
    justifyContent: "center",
    marginTop: height * 0.9,
  },
  tips: {
    flex: 1,
    height: tipsHeight,
  },
  checkBox: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  message: {
    color: "black",
    fontSize: 20,
    alignSelf: "center",
  },
  camera: {
    height: height,
    width: width,
    marginTop: topMargin,
  },
  btn: {
    alignItems: "center",
    alignSelf: "flex-end",
    flex: 1,
  },
  iconCam: {
    marginBottom: 10,
  },

  actions: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 20,
    height: tipsHeight,
  },
});
