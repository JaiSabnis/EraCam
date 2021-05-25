import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Info(props) {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.ellipseStackColumnRow}>
        <View style={styles.ellipseStackColumn}>
          <View style={styles.ellipseStack}>
            <Svg viewBox="0 0 275.43 317.82" style={styles.ellipse}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="rgba(248,231,28,1)"
                cx={138}
                cy={159}
                rx={138}
                ry={159}
              ></Ellipse>
            </Svg>
            <Svg viewBox="0 0 245.92 244.51" style={styles.ellipse2}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="rgba(247,11,247,1)"
                cx={123}
                cy={122}
                rx={123}
                ry={122}
              ></Ellipse>
            </Svg>
          </View>
          <Icon name="information-outline" style={styles.iconInf}></Icon>
        </View>
        <View style={styles.eraColumn}>
          <Text style={styles.era}>Era</Text>
          <Svg viewBox="0 0 229.05 234.67" style={styles.ellipse3}>
            <Ellipse
              stroke="rgba(230, 230, 230,1)"
              strokeWidth={0}
              fill="rgba(230, 230, 230,1)"
              cx={115}
              cy={117}
              rx={115}
              ry={117}
            ></Ellipse>
          </Svg>
        </View>
      </View>
      <View style={styles.loremIpsumStack}>
        <Text style={styles.loremIpsum}></Text>
        <Text style={styles.text}>
          This box tells you how good the angle for your selfie is
        </Text>
      </View>
      <View style={styles.rect}>
        <Text style={styles.loremIpsum2}>85</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    infoContainer: {
    flex: 1,
    opacity: 0.77,
  },
  ellipse: {
    top: 79,
    left: 0,
    width: 275,
    height: 318,
    position: "absolute",
    opacity: 0.55,
  },
  ellipse2: {
    top: 0,
    left: 92,
    width: 246,
    height: 245,
    position: "absolute",
    opacity: 0.65,
  },
  ellipseStack: {
    width: 338,
    height: 397,
  },
  iconInf: {
    color: "rgba(46,45,45,1)",
    fontSize: 40,
    marginTop: 59,
    marginLeft: 138,
  },
  ellipseStackColumn: {
    width: 338,
  },
  era: {
    color: "#121212",
    fontSize: 80,
  },
  ellipse3: {
    width: 229,
    height: 235,
    marginTop: 7,
    marginLeft: 25,
  },
  eraColumn: {
    width: 254,
    marginLeft: 12,
    marginTop: 143,
    marginBottom: 21,
  },
  ellipseStackColumnRow: {
    height: 500,
    flexDirection: "row",
    marginTop: -79,
    marginLeft: -113,
    marginRight: -116,
  },
  loremIpsum: {
    top: 70,
    left: 138,
    position: "absolute",
    color: "#121212",
  },
  text: {
    left: 0,
    position: "absolute",
    color: "#121212",
    right: 0,
    fontSize: 30,
    top: 0,
    textAlign: "left",
  },
  loremIpsumStack: {
    height: 105,
    marginTop: 8,
    marginLeft: 25,
    marginRight: 50,
  },
  rect: {
    width: 96,
    height: 100,
    backgroundColor: "rgba(21,218,33,0.48)",
    marginTop: 31,
    marginLeft: 25,
  },
  loremIpsum2: {
    color: "rgba(255,255,255,1)",
    fontSize: 50,
    marginTop: 21,
    marginLeft: 20,
  },
});

export default Info;
