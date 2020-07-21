import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Container, Header, Content, Badge, Text, Icon } from "native-base";

import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as FaceDetector from "expo-face-detector";
import Constants from "expo-constants";
import * as ScreenOrientation from "expo-screen-orientation";
import * as ImageManipulator from "expo-image-manipulator";

import Mask from "./mask";

const width = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const height = width * (16 / 9);
const topMargin = 0;
const cardHeight = height / 0.2;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPerm: null,
      hasMedia: null,
      type: Camera.Constants.Type.front,
      flash: Camera.Constants.FlashMode.off,
      message: "",
      currentWidth: 0,
      photo: "empty",
      picTaken: false,
      images: [],
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { savePerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.setState({
      hasPerm: status === "granted",
      hasMedia: savePerm === "granted",
    });
    if (Platform.OS === "android") {
      StatusBar.setBarStyle("light-content", true);
      StatusBar.setBackgroundColor("black");
    }

    /*
    ScreenOrientation.addOrientationChangeListener(() => {
      console.log(ScreenOrientation.getOrientationAsync());
    });
    */

    // console.log(ScreenOrientation.getOrientationAsync());
  }

  takePic = async () => {
    this.camera
      .takePictureAsync({ quality: 0.5, skipProcessing: false })
      .then((data) => {
        this.camera.pausePreview();
        var stateImages = this.state.images;

        /*
        if (this.state.type === Camera.Constants.Type.front) {
          ImageManipulator.manipulateAsync(
            data.uri,
            [{ flip: ImageManipulator.FlipType.Horizontal }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          ).then((imageResult) => {
            stateImages.push(imageResult.uri);
          });
        } else {
          stateImages.push(data.uri);
        }
        */
        stateImages.push(data.uri);
        this.setState({
          images: stateImages,
        });
      });
  };

  saveImage = async (uri) => {
    const asset = MediaLibrary.createAssetAsync(uri);
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
    var groupPic = false;
    var allSmiles = true;
    var shutEye = false;
    var changePosition = false;

    if (faces.length > 1) {
      groupPic = true;
    }

    // ANGLES
    var faceWidths = [];
    // get faceWidths for different setups
    if (this.state.type === Camera.Constants.Type.front) {
      for (let i = 0; i < faces.length; i++) {
        let faceWidth =
          faces[i].rightCheekPosition.x - faces[i].leftCheekPosition.x;
        faceWidths.push(faceWidth);
      }
    } else if (this.state.type === Camera.Constants.Type.back) {
      for (let i = 0; i < faces.length; i++) {
        let faceWidth =
          faces[i].leftCheekPosition.x - faces[i].rightCheekPosition.x;
        faceWidths.push(faceWidth);
      }
    }

    // calculations
    var total = 0;
    for (var i = 0; i < faceWidths.length; i++) {
      total += faceWidths[i];
    }
    var avgWidthRound = total / faceWidths.length;
    var avgWidth = Math.round(((600 + avgWidthRound) * 1) / 6);

    if (0 < avgWidth <= 100) {
      this.setState({
        currentWidth: avgWidth,
      });
    }
  };

  render() {
    const {
      hasPerm,
      hasMedia,
      message,
      currentWidth,
      picTaken,
      photo,
    } = this.state;

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
      if (picTaken === false) {
        return (
          <SafeAreaView style={styles.container}>
            <Camera
              style={styles.camera}
              type={this.state.type}
              ratio="16:9"
              pictureSize="16:9"
              flashMode={Camera.Constants.FlashMode.off}
              // autoFocus={Camera.Constants.AutoFocus.on}
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
              {/* Grid */}
              <View>
                <View style={styles.colContainer}>
                  <View style={styles.col}></View>
                  <View style={styles.col}></View>
                </View>

                <View style={styles.row}></View>
                <View style={styles.row}></View>
              </View>

              {message !== "" ? (
                <Badge style={styles.greyBadge}>
                  <Text style={styles.angleRating}>{message}</Text>
                </Badge>
              ) : (
                <View></View>
              )}

              {80 < currentWidth ? (
                <Badge style={styles.greenBadge}>
                  <Text>Angle Rating: {currentWidth} %</Text>
                </Badge>
              ) : (
                <Badge style={styles.orangeBadge}>
                  <Text style={styles.angleRating}>
                    Angle Rating: {currentWidth} %
                  </Text>
                </Badge>
              )}
            </Camera>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.flipCam()}
              >
                <FontAwesome name="camera" size={20} style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.takePic()}
              >
                <Entypo name="circle" size={40} style={styles.icon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.setState({ picTaken: true })}
              >
                <FontAwesome name="flash" size={20} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView style={styles.container}>
            <ScrollView>
              {this.state.images.map((item, index) => {
                return (
                  <View key={index}>
                    <Image source={{ uri: item }} style={styles.image} />
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.saveImage(item)}
                      >
                        <Text style={styles.message}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
  },
  angleRating: {
    color: "white",
  },
  greenBadge: {
    backgroundColor: "rgba(50,205,50, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-end",
  },
  greyBadge: {
    backgroundColor: "rgba(128,128,128, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-start",
  },
  orangeBadge: {
    backgroundColor: "rgba(255,165,0, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-end",
  },

  colContainer: {
    flex: 1,
    flexDirection: "row",
  },
  card: {
    width: width * 0.9,
    borderRadius: 30,
    alignSelf: "center",
    borderWidth: 0.5,
    justifyContent: "center",
    zIndex: 4,
    position: "absolute",
    top: height * 0.9,
    // backgroundColor: "rgba(0,0,0,0.5)",
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 20,
    marginTop: 10,
    zIndex: 3,
  },
  col: {
    height: height,
    width: width * (1 / 3),
    borderRightWidth: 0.5,
    borderRightColor: "white",
    zIndex: 1,
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
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  icon: {
    marginBottom: 10,
    color: "white",
  },

  tips: {
    flex: 1,
  },
  checkBox: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  message: {
    color: "orange",
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
    marginTop: 10,
    color: "white",
  },
});

/*
    if (groupPic) {
      for (let i = 0; i < faces.length; i++) {
        if (
          faces[i].rightEyeOpenProbability < 0.3 &&
          faces[i].leftEyeOpenProbability < 0.3
        ) {
          shutEye = true;
        }
      }
      if (shutEye === false) {
        this.setState({ message: "" });
      } else {
        this.setState({ message: "You might be blinking" });
      }
    }

    // FACE POSITION
    if (!groupPic) {
      for (let i = 0; i < faces.length; i++) {
        //console.log(faces[i].leftEyePosition.x);

        if (
          faces[i].leftEyePosition.y > 500 ||
          faces[i].rightEyePosition.y > 500 ||
          faces[i].rightEyePosition.x < 0
        ) {
          changePosition = true;
        }

        if (faces[i].smilingProbability < 0.5) {
          allSmiles = false;
        }
      }

      if (allSmiles === true && changePosition === false) {
        this.setState({ message: "" });
      } else if (allSmiles === false && changePosition === false) {
        this.setState({ message: "Say Cheese!" });
      } else if (allSmiles === false && changePosition === true) {
        this.setState({ message: "Try moving your face into frame" });
      }
    }

    */
