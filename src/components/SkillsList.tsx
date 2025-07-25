import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SkillsListProps, SkillCardProps } from "@/types";
import {
  formatLevel,
  formatLevelToPercentage,
  sortSkillsByLevel,
} from "@/utils";

export const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  title = "Skills",
}) => {
  const sortedSkills = sortSkillsByLevel(skills);

  if (skills.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noSkills}>No skills available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.skillsContainer}
      >
        {sortedSkills.map((skill, index) => (
          <SkillCard key={`${skill.id}-${index}`} skill={skill} />
        ))}
      </ScrollView>
    </View>
  );
};

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const percentage = (skill.level % 1) * 100;
  const level = Math.floor(skill.level);

  return (
    <View style={styles.skillCard}>
      <Text style={styles.skillName}>{skill.name}</Text>
      <Text style={styles.skillLevel}>Level {formatLevel(skill.level)}</Text>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {formatLevelToPercentage(skill.level)}
        </Text>
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  noSkills: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  skillsContainer: {
    flexDirection: "row",
  },
  skillCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  skillName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
    textAlign: "center",
  },
  skillLevel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6b7280",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
});
