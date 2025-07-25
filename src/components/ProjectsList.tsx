import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ProjectsListProps,
  ProjectUser,
  User,
  ProjectCardProps,
} from "@/types";
import {
  formatDate,
  formatFinalMark,
  formatProjectStatus,
  sortProjectsByDate,
} from "@/utils";

// Grouper les projets par cursus
const groupProjectsByCursus = (projects: ProjectUser[], user: User) => {
  const cursusMap = user.cursus_users.reduce((acc, cu) => {
    acc[cu.cursus_id] = cu.cursus.name;
    return acc;
  }, {} as Record<number, string>);

  const grouped = projects.reduce((acc, project) => {
    project.cursus_ids.forEach((cursusId) => {
      const cursusName = cursusMap[cursusId] || `Cursus ${cursusId}`;
      if (!acc[cursusName]) {
        acc[cursusName] = [];
      }
      acc[cursusName].push(project);
    });
    return acc;
  }, {} as Record<string, ProjectUser[]>);

  // Trier les projets dans chaque cursus
  Object.keys(grouped).forEach((cursusName) => {
    grouped[cursusName] = sortProjectsByDate(grouped[cursusName]);
  });

  return grouped;
};

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  user,
  title = "Projects",
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const groupedProjects = groupProjectsByCursus(projects, user);
  const cursusNames = Object.keys(groupedProjects).sort();

  const toggleSection = (cursusName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [cursusName]: !prev[cursusName],
    }));
  };

  if (projects.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noProjects}>No projects available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title} ({projects.length})
      </Text>

      {cursusNames.map((cursusName) => {
        const isExpanded = expandedSections[cursusName];
        const cursusProjects = groupedProjects[cursusName];

        return (
          <View key={cursusName} style={styles.cursusSection}>
            <TouchableOpacity
              style={styles.cursusHeader}
              onPress={() => toggleSection(cursusName)}
            >
              <Text style={styles.cursusTitle}>
                {cursusName} ({cursusProjects.length})
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.projectsContainer}>
                {cursusProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusInfo = formatProjectStatus(
    project.status,
    project["validated?"],
    project.final_mark
  );
  const mark = formatFinalMark(project.final_mark);

  return (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectName} numberOfLines={2}>
          {project.project.name}
        </Text>
        <View style={styles.projectMeta}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
          {project.final_mark !== null && (
            <View style={styles.markContainer}>
              <Text style={styles.markText}>{mark}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.projectDetails}>
        <Text style={styles.projectDate}>
          Created: {formatDate(project.created_at)}
        </Text>
        {project.marked_at && (
          <Text style={styles.projectDate}>
            Marked: {formatDate(project.marked_at)}
          </Text>
        )}
      </View>

      {project.occurrence > 0 && (
        <View style={styles.occurrenceContainer}>
          <Text style={styles.occurrenceText}>Retry #{project.occurrence}</Text>
        </View>
      )}
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
  noProjects: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  projectCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 8,
  },
  projectMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  markContainer: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  markText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1f2937",
  },
  projectDetails: {
    gap: 2,
  },
  projectDate: {
    fontSize: 11,
    color: "#6b7280",
  },
  occurrenceContainer: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  occurrenceText: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "600",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cursusSection: {
    marginBottom: 16,
  },
  cursusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  cursusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  projectsContainer: {
    paddingLeft: 8,
  },
});
