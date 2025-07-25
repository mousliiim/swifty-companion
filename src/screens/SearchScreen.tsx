import React, { useState } from "react";
import { LoadingSpinner } from "@/components";
import { api42 } from "@/services";
import { SearchScreenProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SearchScreen: React.FC<SearchScreenProps> = ({ onUserFound }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDetails = await api42.getUserDetails(searchQuery.trim());
      onUserFound(userDetails);
    } catch (error) {
      console.error("Search error:", error);

      // Vérifier si c'est une erreur réseau
      if (
        error instanceof Error &&
        (error.message.includes("Network request failed") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("network") ||
          error.message.includes("NETWORK_ERROR") ||
          error.message.includes("ECONNREFUSED"))
      ) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
        return;
      }

      // Si c'est une erreur 404, l'utilisateur n'existe pas
      if (
        error instanceof Error &&
        (error.message.includes("404") ||
          error.message.includes("User not found"))
      ) {
        setError(
          `User "${searchQuery.trim()}" not found. Please check the login and try again.`
        );
        return;
      }

      // Pour les autres erreurs de l'API
      setError("Unable to search. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // FONCTION DE DEMO POUR LA CORRECTION pour démontrer le rafraîchissement du token
  const handleTokenDemo = async () => {
    try {
      console.log("🔧 DEMO DÉBUT: Démonstration du rafraîchissement du token");

      // 1. Vérifier l'état actuel du token
      console.log("📊 AVANT:", api42.getTokenDebugInfo());

      // 2. Forcer l'expiration du token
      api42.forceTokenExpiration();
      console.log("⏰ Expiration du token forcée");

      // 3. Vérifier l'état du token après l'expiration
      console.log("📊 APRÈS EXPIRATION:", api42.getTokenDebugInfo());

      // 4. Faire un appel API pour déclencher le rafraîchissement automatique
      console.log(
        "🔄 Appel API en cours pour déclencher le rafraîchissement..."
      );

      const testUser = await api42.getUserDetails("mmourdal");

      // 5. Vérifier l'état du token après le rafraîchissement
      console.log("📊 APRÈS RAFRAÎCHISSEMENT:", api42.getTokenDebugInfo());
      console.log("✅ DEMO RÉUSSIE: Token automatiquement rafraîchi!");

      alert("Démonstration terminée! Consultez la console pour les détails.");
    } catch (error) {
      console.error("❌ Erreur de démo:", error);
      alert("La démo a échoué. Consultez la console pour les détails.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoadingSpinner message="Searching for user..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/42logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Swifty Companion</Text>
              <Text style={styles.subtitle}>
                Search for 42 students and explore their profiles
              </Text>
            </View>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#9ca3af"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter a login (e.g., your login)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
                maxLength={50}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.searchButton,
                !searchQuery.trim() && styles.searchButtonDisabled,
              ]}
              onPress={handleSearch}
              disabled={!searchQuery.trim() || loading}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message under search */}
          {error && (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          )}

          {/* Examples */}
          <View style={styles.examplesSection}>
            <Text style={styles.examplesTitle}>Try searching for:</Text>
            <View style={styles.examplesList}>
              {["mmourdal", "rferradi", "dtoure"].map((example) => (
                <TouchableOpacity
                  key={example}
                  style={styles.exampleChip}
                  onPress={() => setSearchQuery(example)}
                >
                  <Text style={styles.exampleText}>{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section pour la démonstration du rafraîchissement du token */}
          {/*
            <View style={styles.demoSection}>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleTokenDemo}
              >
                <Text style={styles.demoButtonText}>🔧 Démo: Rafraîchissement du token</Text>
              </TouchableOpacity>
            </View>
            */}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Powered by 42 API & Mouss with ❤️
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  searchSection: {
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  searchButton: {
    backgroundColor: "#4b5563",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorMessageContainer: {
    marginBottom: 30,
  },
  errorMessage: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  examplesSection: {
    marginBottom: 30,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  examplesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exampleChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  exampleText: {
    color: "#4b5563",
    fontWeight: "500",
  },
  demoSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  demoButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d97706",
  },
  demoButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorSection: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    opacity: 0.5,
    paddingTop: "95%",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
