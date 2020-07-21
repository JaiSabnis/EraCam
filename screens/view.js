import { Surface } from "gl-react-expo";
import { FontAwesome } from "@expo/vector-icons";
import ImageFilters from "react-native-gl-image-filters";
import { captureRef } from "react-native-view-shot";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
import React from "react";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";
import * as ImageManipulator from "expo-image-manipulator";

const width = Dimensions.get("window").width;
const height = width * (16 / 9);

const settings = [
  {
    name: "hue",
    minValue: -100.0,
    maxValue: 100.0,
  },
  {
    name: "blur",
    maxValue: 2.0,
  },
  {
    name: "sepia",
    maxValue: 2.0,
  },
  {
    name: "sharpen",
    maxValue: 2.0,
  },
  {
    name: "negative",
    maxValue: 2.0,
  },
  {
    name: "contrast",
    maxValue: 2.0,
  },
  {
    name: "saturation",
    maxValue: 2.0,
  },
  {
    name: "brightness",
    maxValue: 2.0,
  },
  {
    name: "temperature",
    minValue: 1000.0,
    maxValue: 40000.0,
  },
];

export default class ViewImage extends React.Component {
  state = {
    ...settings,
    hue: 0.0,
    blur: 0.0,
    sepia: 0,
    sharpen: 0.0,
    negative: 0,
    contrast: 1,
    saturation: 1,
    brightness: 1,
    temperature: 400,
    image: null,
  };

  screenShot = () => {
    this.refs.viewShot.capture().then((uri) => {
      console.log(uri);
      this.saveImage(uri);
    });
    this.props.navigation.navigate("Home");
  };

  saveImage = async (uri) => {
    const asset = MediaLibrary.createAssetAsync(uri);
  };

  async componentDidMount() {
    const imageResult = await ImageManipulator.manipulateAsync(
      this.props.navigation.getParam("photo"),
      [{ flip: ImageManipulator.FlipType.Horizontal }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    this.setState({ image: imageResult.uri });
  }

  render() {
    let photo = this.props.navigation.getParam("photo", "empty");
    // const { image } = this.state;

    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.image} />
        <Button
          // onPress={this.props.navigation.navigate("Home")}
          title="Take Another"
        />

        {/*

        <ViewShot
          style={styles.imageContainer}
          ref="viewShot"
          options={{ format: "png", quality: 1 }}
        >
          <Surface
            style={{ width: "100%", height: 500 }}
            ref={(ref) => (this.image = ref)}
          >
            <ImageFilters {...this.state} width={width} height={width}>
              {{
                uri: photo,
              }}
            </ImageFilters>
          </Surface>
        </ViewShot>
        <Button
          onPress={() => this.screenShot()}
          title="Learn "
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
                    */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    marginTop: 100,
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
  image: {
    width: width,
    height: height,
  },
});
