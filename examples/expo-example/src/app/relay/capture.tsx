import { relayExpoClient } from "@/libs/relay-client";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RelayCaptureScreen() {
  const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>();

  useEffect(() => {
    if (!returnUrl) return;
    relayExpoClient.capture(returnUrl);
  }, [returnUrl]);

  return (
    <View style={s.container}>
      <Text style={s.title}>Capture Screen</Text>
      <Text>This screen captures the relay data.</Text>
      <Text>If a returnUrl parameter is provided, it will initiate the capture.</Text>
      <Text>Return to: {returnUrl ?? "N/A"}</Text>
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
