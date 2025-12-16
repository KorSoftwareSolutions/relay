import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/client/index.ts"],
  external: ["expo-clipboard", "expo-device", "expo-localization", "react-native"],
  outDir: "dist",
  dts: true,
  exports: {
    devExports: "dev-source",
  },
  onSuccess() {
    console.info("🙏 Build succeeded!");
  },
});
