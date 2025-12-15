import { relayExpoClient } from "@/libs/relay-client";
import { Href, router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RelayProcessScreen() {
  useEffect(() => {
    relayExpoClient.process().then((res) => {
      if (!res.url) return;
      router.replace(res.url as Href);
    });
  }, []);

  return (
    <View style={s.container}>
      <Text style={s.title}>Process Screen</Text>
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
