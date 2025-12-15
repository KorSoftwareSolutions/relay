import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/server.ts", "./src/expo.ts"],
  external: ["expo-clipboard", "expo-device", "expo-localization", "react-native"],
  onSuccess() {
    console.info("🙏 Build succeeded!");
  },
});
