import React from "react";
import { UserCardProps } from "@/types";
import { formatLevel, getMainCampus, getMainCursus } from "@/utils";
import { OnlineIndicator } from "@/components/OnlineIndicator";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const mainCursus = getMainCursus(user.cursus_users);
  const campus = getMainCampus(user);

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.image?.versions?.medium || user.image?.link }}
          style={styles.avatar}
          defaultSource={require("../../assets/icon.png")}
        />
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{user.displayname}</Text>
          <Text style={styles.login}>@{user.login}</Text>
          <Text style={styles.campus}>{campus}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{user.email}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wallet:</Text>
          <Text style={styles.detailValue}>{user.wallet} ₳</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Correction Points:</Text>
          <Text style={styles.detailValue}>{user.correction_point}</Text>
        </View>

        {mainCursus && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Level:</Text>
            <Text style={styles.detailValue}>
              {formatLevel(mainCursus.level)} - {mainCursus.cursus.name}
            </Text>
          </View>
        )}

        {user.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.detailValue}>{user.location}</Text>
              <OnlineIndicator />
            </View>
          </View>
        )}
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: "#f3f4f6",
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  login: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  campus: {
    fontSize: 12,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    justifyContent: "flex-end",
  },
});
