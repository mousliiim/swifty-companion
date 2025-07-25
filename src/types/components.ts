import { Ionicons } from '@expo/vector-icons';
import { User, Skill, ProjectUser } from './api';

// OnlineIndicator Props
export interface OnlineIndicatorProps {
  size?: number;
  color?: string;
}

// UserCard Props
export interface UserCardProps {
  user: User;
  onPress?: () => void;
}

// SkillsList Props
export interface SkillsListProps {
  skills: Skill[];
  title?: string;
}

export interface SkillCardProps {
  skill: Skill;
}

// ProjectsList Props
export interface ProjectsListProps {
  projects: ProjectUser[];
  user: User;
  title?: string;
}

export interface ProjectCardProps {
  project: ProjectUser;
}

// UIStates Props
export interface LoadingSpinnerProps {
  message?: string;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
  actionLabel?: string;
}


// SearchScreen Props
export interface SearchScreenProps {
  onUserFound: (user: User) => void;
}

// UserDetailScreen Props
export interface UserDetailScreenProps {
  user: User;
  onBack: () => void;
}