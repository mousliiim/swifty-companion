import React, { useState } from "react";
import { SearchScreen, User, UserDetailScreen } from "@/index";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleUserFound = (user: User) => {
    setCurrentUser(user);
  };

  const handleBackToSearch = () => {
    setCurrentUser(null);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {currentUser ? (
        <UserDetailScreen user={currentUser} onBack={handleBackToSearch} />
      ) : (
        <SearchScreen onUserFound={handleUserFound} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
