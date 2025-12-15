import { Stack } from "expo-router";

export default function RelayLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="capture" />
      <Stack.Screen name="process" />
    </Stack>
  );
}
