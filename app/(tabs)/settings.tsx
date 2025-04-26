import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Settings = () => {
  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all learning data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => console.log("Reset logic goes here") },
      ]
    );
  };

  const handleExportData = () => {
    console.log("Export logic goes here");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold mb-6">Settings</Text>

        {/* Reset Progress */}
        <TouchableOpacity
          onPress={() => router.push("/deleted-words")}
          className="flex-row items-center justify-between bg-green-100 border border-green-300 p-4 rounded-2xl mb-4"
        >
          <Text className="text-lg text-green-600 font-medium">
            Deleted Words
          </Text>
          <Ionicons name="trash-bin" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResetProgress}
          className="flex-row items-center justify-between bg-red-100 border border-red-300 p-4 rounded-2xl mb-4"
        >
          <Text className="text-lg text-red-600 font-medium">
            Reset Progress
          </Text>
          <Ionicons name="refresh-circle" size={24} color="red" />
        </TouchableOpacity>

        {/* Export Data */}
        <TouchableOpacity
          onPress={handleExportData}
          className="flex-row items-center justify-between bg-blue-100 border border-blue-300 p-4 rounded-2xl"
        >
          <Text className="text-lg text-blue-600 font-medium">Export Data</Text>
          <Ionicons name="cloud-download" size={24} color="blue" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
