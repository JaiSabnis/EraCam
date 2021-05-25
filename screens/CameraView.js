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
  Text,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Badge,
  Card,
  CardItem,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";

import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as FaceDetector from "expo-face-detector";
import Constants from "expo-constants";
import * as ScreenOrientation from "expo-screen-orientation";
import * as ImageManipulator from "expo-image-manipulator";
import * as Sharing from "expo-sharing";
import { DeviceMotion } from "expo-sensors";

const width = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const height = width * (16 / 9);
const topMargin = (deviceHeight * 0.8 - height) / 2;

export default class CameraView extends React.Component {
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
      isClicked: false,
    };
    /*
    imageSort(){
      return images.sort((a, b) =>
      a.value < b.value ? 1 : b.value < a.value ? -1 : 0
    );
    }
    */
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
    if (await DeviceMotion.isAvailableAsync()) {
      DeviceMotion.addListener((motionData) => {
        console.log(motionData);
      });
    }
    */
  }

  takePic = async () => {
    var widthVal = this.state.currentWidth;
    this.camera
      .takePictureAsync({ quality: 0.4, skipProcessing: true })
      .then((data) => {
        // this.camera.pausePreview();
        var stateImages = this.state.images;
        stateImages.push({
          pic: data.uri,
          value: widthVal,
          isSaved: false,
          isSelfie: this.state.type === Camera.Constants.Type.front,
        });

        this.setState({
          images: stateImages,
        });
      });
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

  displayMode = () => {
    if (this.state.images.length > 0) {
      // this.setState({ picTaken: true });
      this.props.navigation.navigate("ViewImage", {
        images: this.state.images,
      });
    }
  };

  handleFacesDetected = ({ faces }) => {
    var allSmiles = true;
    var shutEye = false;
    var changePosition = false;

    this.setState({ message: "" });

    // ANGLES
    var faceWidths = [];
    // get faceWidths for different setups
    for (let i = 0; i < faces.length; i++) {
      let faceWidth =
        faces[i].rightCheekPosition.x - faces[i].leftCheekPosition.x;
      faceWidths.push(faceWidth);
    }

    // calculations

    var total = 0;
    for (var i = 0; i < faceWidths.length; i++) {
      total += faceWidths[i];
    }

    var avgWidthRound = total / faceWidths.length;
    var avgWidth = Math.round(((600 + avgWidthRound) * 1) / 6);

    if (Number.isNaN(avgWidth) || avgWidth < 0) {
      avgWidth = 0;
    } else if (avgWidth > 93) {
      avgWidth = 93;
      this.setState({
        message: "Your Camera might be too far!",
      });
    }

    if (0 < avgWidth <= 100) {
      this.setState({
        currentWidth: avgWidth,
      });
    }

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

    // FACE POSITION
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
  };

  renderRating = () => {
    if (this.state.type === Camera.Constants.Type.front) {
      if (80 < this.state.currentWidth) {
        return (
          <Badge style={styles.greenBadge}>
            <Text style={{ color: "white" }}> Angle Quality: </Text>
            <Text style={styles.angleRatingPo}>{this.state.currentWidth}</Text>
          </Badge>
        );
      } else {
        return (
          <Badge style={styles.orangeBadge}>
            <Text style={{ color: "white" }}> Angle Quality: </Text>
            <Text style={styles.angleRatingPo}>{this.state.currentWidth}</Text>
          </Badge>
        );
      }
    }

    return null;
  };

  render() {
    const {
      hasPerm,
      hasMedia,
      message,
      currentWidth,
      isClicked,
      picTaken,
      images,
    } = this.state;

    // images.sort((a, b) => (a.value < b.value ? 1 : b.value < a.value ? -1 : 0));

    if (hasPerm === null && hasMedia === null) {
      return <View />;
    } else if (hasPerm === false && hasMedia === false) {
      return (
        <SafeAreaView style={styles.whiteContainer}>
          <Text> We need camera permissions to work our magic! </Text>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={() => this.takePic()}>
            <Camera
              style={styles.camera}
              type={this.state.type}
              ratio="16:9"
              pictureSize="16:9"
              flashMode={Camera.Constants.FlashMode.auto}
              autoFocus={Camera.Constants.AutoFocus.on}
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
                  <Text style={{ color: "white", fontSize: 20 }}>
                    {message}
                  </Text>
                </Badge>
              ) : (
                <View></View>
              )}

              {isClicked ? <View style={styles.overlay}></View> : <View />}
            </Camera>
          </TouchableOpacity>

          {this.renderRating()}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={() => this.flipCam()}>
              <Ionicons name="ios-reverse-camera" size={35} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.info}>
              <Badge style={styles.infoBadge}>
                <AntDesign name="infocirlceo" size={20} color="white" />
                <Text style={{ color: "white" }}> Tap Screen to Click</Text>
              </Badge>
            </TouchableOpacity>

            {/*
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.takePic()}
              >
                <Entypo name="circle" size={40} style={styles.icon} />
              </TouchableOpacity>
*/}

            {images.length > 0 ? (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.displayMode()}
              >
                <EvilIcons name="check" size={40} color="orange" />
                <Text style={{ color: "white" }}>
                  {" "}
                  {this.state.images.length}{" "}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => this.displayMode()}
              >
                <Text style={{ color: "white" }}>
                  {" "}
                  {this.state.images.length}{" "}
                </Text>
                <EvilIcons name="check" size={40} color="grey" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
  },
  circle: {
    width: 500,
    height: 500,
    borderRadius: 500 / 2,
    backgroundColor: "grey",
    position: "absolute",
    left: -120,
    top: -20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
    color: "orange",
    marginTop: 10,
    marginBottom: 40,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "darkgrey",
    marginBottom: 50,
  },
  angleRatingPo: {
    color: "white",
    fontSize: height * 0.04,
  },
  angleRatingHo: {
    color: "white",
    fontSize: height * 0.04,
    transform: [{ rotate: "90deg" }],
  },
  greenBadge: {
    backgroundColor: "rgba(50,205,50, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-end",
    height: height * 0.1,
    width: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  switch: {
    position: "absolute",
    top: height * 0.1,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  blueHeaderBadge: {
    backgroundColor: "skyblue",
    alignSelf: "center",
    height: deviceHeight * 0.1,
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "row",
    width: width * 1.2,
  },
  greyBadge: {
    backgroundColor: "rgba(128,128,128, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-start",
    height: height * 0.05,
  },

  orangeBadge: {
    backgroundColor: "rgba(255,165,0, 0.5)",
    position: "absolute",
    top: height * 0.9,
    alignSelf: "flex-end",
    height: height * 0.1,
    width: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  infoBadge: {
    backgroundColor: "rgba(52, 161, 235, 0.5)",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: width * 0.5,
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
    zIndex: 3,
    height: deviceHeight * 0.1,
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
  whiteContainer: {
    flex: 1,
    backgroundColor: "white",
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
  info: {
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
Ø
      if (allSmiles === true && changePosition === false) {
        this.setState({ message: "" });
      } else if (allSmiles === false && changePosition === false) {
        this.setState({ message: "Say Cheese!" });
      } else if (allSmiles === false && changePosition === true) {
        this.setState({ message: "Try moving your face into frame" });
      }
    }


// HELLLOO




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



  renderSwitch = () => {
    if (this.state.isPo) {
      return (
        <TouchableOpacity
          style={styles.switch}
          onPress={() =>
            this.setState({
              isPo: false,
              message: "Landscape",
            })
          }
        >
          <MaterialCommunityIcons
            name="phone-rotate-landscape"
            size={35}
            color="white"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.switch}
          onPress={() => this.setState({ isPo: true, message: "Portrait" })}
        >
          <MaterialCommunityIcons
            name="phone-rotate-portrait"
            size={35}
            color="orange"
          />
        </TouchableOpacity>
      );
    }
  };

    */
/*
        if (this.state.type === Camera.Constants.Type.front) {
          ImageManipulator.manipulateAsync(
            data.uri,
            [{ flip: ImageManipulator.FlipType.Horizontal }],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG }
          ).then((imageResult) => {
            stateImages.push({
              pic: imageResult.uri,
              value: widthVal,
              isSaved: false,
            });
          });
        } else {
          stateImages.push({ pic: data.uri, value: widthVal, isSaved: false });
        }
        */
