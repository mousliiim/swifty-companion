import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LoadingSpinnerProps, EmptyStateProps } from "@/types";

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4b5563" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  iconName = "search-outline",
  onAction,
  actionLabel = "Try Again",
}) => (
  <View style={styles.emptyContainer}>
    <Ionicons name={iconName} size={64} color="#a0a0a0" />
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
    {onAction && (
      <TouchableOpacity style={styles.actionButton} onPress={onAction}>
        <Text style={styles.actionButtonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: "#f9fafb",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  actionButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});
