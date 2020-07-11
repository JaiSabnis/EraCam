import React from "react";
import { StyleSheet, View } from "react-native";
import AppNav from "./routes/nav";

export default function App() {
  return <AppNav />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
