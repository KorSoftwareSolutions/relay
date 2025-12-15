import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Home Screen</Text>
      <Button title="Capture" onPress={() => router.navigate("/relay/capture")} />
      <Button title="Process" onPress={() => router.navigate("/relay/process")} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    maxWidth: 400,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
