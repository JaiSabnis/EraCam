import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
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

export default class ViewImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.navigation.getParam("images", []),
    };
  }

  saveImage = async (uri) => {
    const asset = MediaLibrary.createAssetAsync(uri);
  };

  shareImage = async (uri) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(uri);
  };

  flipImage = (uri, index) => {
    ImageManipulator.manipulateAsync(
      uri,
      [{ flip: ImageManipulator.FlipType.Horizontal }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    ).then((imageResult) => {
      editImages = this.state.images;
      editImages[index].pic = imageResult.uri;
      this.setState({ images: editImages });
    });
  };

  render() {
    const { images } = this.state;

    return (
      <SafeAreaView style={styles.whiteContainer}>
        <TouchableOpacity
          onPress={() => {
            // this.setState({ images: [], picTaken: false });
            this.props.navigation.navigate("CameraView");
          }}
        >
          <Badge style={styles.blueHeaderBadge}>
            <AntDesign name="leftcircleo" size={23} color="black" />
            <Text style={{ color: "black" }}>
              {"  "}
              Back to Camera{" "}
            </Text>
          </Badge>
        </TouchableOpacity>

        <FlatList
          data={images}
          renderItem={({ item }, index) => {
            return (
              <Card>
                <CardItem cardBody>
                  <Image source={{ uri: item.pic }} style={styles.image} />
                </CardItem>
                <CardItem>
                  <Left>
                    {item.isSaved ? (
                      <View>
                        <Entypo name="heart" size={40} color="red" />
                        <Text style={{ alignSelf: "center" }}>
                          Saved in Gallery
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.saveImage(item.pic);
                          var imagesArray = this.state.images;
                          // var index = imagesArray.indexOf()
                          // let index = markers.findIndex(el => el.name === 'name');
                          // imagesArray.splice(index, 1);
                          imagesArray[index] = {
                            pic: item.pic,
                            value: item.value,
                            isSaved: true,
                            isSelfie: item.subtitleisSelfie,
                          };

                          this.setState({ images: imagesArray });
                        }}
                      >
                        <Entypo name="heart-outlined" size={40} color="red" />
                        <Text style={{ alignSelf: "center" }}>Save</Text>
                      </TouchableOpacity>
                    )}
                  </Left>
                  <Body>
                    <TouchableOpacity
                      onPress={() => {
                        this.shareImage(item.pic);
                      }}
                    >
                      <EvilIcons name="share-apple" size={45} color="green" />
                      <Text>Share</Text>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    <Text>Angle Quality: {item.value}</Text>
                  </Right>
                </CardItem>
              </Card>
            );
          }}
        />

        {/*
        <ScrollView>
          {images.map((item, index) => {
            return (
              <Card key={index}>
                <CardItem cardBody>
                  <Image source={{ uri: item.pic }} style={styles.image} />
                </CardItem>
                <CardItem>
                  <Left>
                    {item.isSaved ? (
                      <View>
                        <Entypo name="heart" size={40} color="red" />
                        <Text style={{ alignSelf: "center" }}>
                          Saved in Gallery
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          this.saveImage(item.pic);
                          // var imagesArray = this.state.images;
                          // var index = imagesArray.indexOf()
                          // let index = markers.findIndex(el => el.name === 'name');
                          // imagesArray.splice(index, 1);
                          images[index] = {
                            pic: item.pic,
                            value: item.value,
                            isSaved: true,
                          };
                          // this.setState({ images: imagesArray });
                        }}
                      >
                        <Entypo name="heart-outlined" size={40} color="red" />
                        <Text style={{ alignSelf: "center" }}>Save</Text>
                      </TouchableOpacity>
                    )}
                  </Left>
                  <Body>
                    <TouchableOpacity
                      onPress={() => {
                        this.shareImage(item.pic);
                      }}
                    >
                      <EvilIcons name="share-apple" size={45} color="green" />
                      <Text>Share</Text>
                    </TouchableOpacity>
                  </Body>
                  <Right>
                    <Text>Angle Quality: {item.value}</Text>
                  </Right>
                </CardItem>
              </Card>
            );
          })}
        </ScrollView>
        */}
      </SafeAreaView>
    );
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
