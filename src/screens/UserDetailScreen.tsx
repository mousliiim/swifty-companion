import { ProjectsList, SkillsList, UserCard } from "@/components";
import { UserDetailScreenProps } from "@/types";
import { getMainCursus } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const UserDetailScreen: React.FC<UserDetailScreenProps> = ({
  user,
  onBack,
}) => {
  const mainCursus = getMainCursus(user.cursus_users);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require("../../assets/42logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte utilisateur principale */}
        <UserCard user={user} />

        {/* Skills */}
        {mainCursus && mainCursus.skills && mainCursus.skills.length > 0 && (
          <SkillsList
            skills={mainCursus.skills}
            title={`Skills - ${mainCursus.cursus.name}`}
          />
        )}

        {/* Projets */}
        {user.projects_users && user.projects_users.length > 0 && (
          <ProjectsList
            projects={user.projects_users}
            user={user}
            title="Projects"
          />
        )}

        {/* Informations supplémentaires si disponibles */}
        {user.cursus_users && user.cursus_users.length > 1 && (
          <View style={styles.additionalCursus}>
            {user.cursus_users
              .slice(1)
              .map(
                (cursusUser, index) =>
                  cursusUser.skills &&
                  cursusUser.skills.length > 0 && (
                    <SkillsList
                      key={`cursus-${cursusUser.cursus_id}-${index}`}
                      skills={cursusUser.skills}
                      title={`Skills - ${cursusUser.cursus.name}`}
                    />
                  )
              )}
          </View>
        )}

        {/* Espace en bas pour la navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 40, // Pour compenser le bouton back et centrer l'icône
  },
  logo: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  additionalCursus: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
