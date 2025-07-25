import { CursusUser, ProjectUser, User } from '@/types';

/**
 * Formate un niveau en pourcentage
 */
export const formatLevelToPercentage = (level: number): string => {
  const percentage = ((level % 1) * 100).toFixed(1);
  return `${percentage}%`;
};

/**
 * Formate un niveau pour l'affichage
 */
export const formatLevel = (level: number): string => {
  return level.toFixed(2);
};

/**
 * Récupère le cursus principal d'un utilisateur (généralement le cursus 42)
 */
export const getMainCursus = (cursusUsers: CursusUser[]): CursusUser | null => {
  // Priorité aux cursus actifs (sans end_at ou end_at dans le futur)
  const activeCursus = cursusUsers.filter(
    cu => !cu.end_at || new Date(cu.end_at) > new Date()
  );

  // Si pas de cursus actif, prendre le plus récent
  const sortedCursus = (
    activeCursus.length > 0 ? activeCursus : cursusUsers
  ).sort(
    (a, b) => new Date(b.begin_at).getTime() - new Date(a.begin_at).getTime()
  );

  return sortedCursus[0] || null;
};

/**
 * Récupère le campus principal d'un utilisateur
 */
export const getMainCampus = (user: User): string => {
  if (!user.campus || user.campus.length === 0) {
    return 'Unknown Campus';
  }

  // Retourner le premier campus ou le campus principal
  return user.campus[0].name;
};

/**
 * Formate le statut d'un projet pour l'affichage
 */
export const formatProjectStatus = (
  status: string,
  validated?: boolean | null,
  finalMark?: number | null
): { text: string; color: string } => {
  switch (status) {
    case 'finished':
      // Si le projet est fini, vérifier la note finale pour déterminer succès/échec
      if (finalMark !== null && finalMark !== undefined) {
        if (finalMark < 100 && validated !== true) {
          return { text: 'Failed', color: '#ef4444' };
        } else {
          return { text: 'Passed', color: '#4CAF50' };
        }
      } else {
        return { text: 'Finished', color: '#6b7280' };
      }
    case 'in_progress':
      return { text: 'In Progress', color: '#f59e0b' };
    case 'waiting_for_correction':
      return { text: 'Waiting for Correction', color: '#3b82f6' };
    case 'searching_a_group':
      return { text: 'Searching a Group', color: '#8b5cf6' };
    default:
      return { text: status, color: '#9ca3af' };
  }
};

/**
 * Formate la note finale d'un projet
 */
export const formatFinalMark = (finalMark: number | null): string => {
  if (finalMark === null) {
    return 'N/A';
  }

  const mark = finalMark.toString();
  
  // Déterminer le succès/échec basé sur la note
  if (finalMark < 50) {
    return `${mark} ✗`; // Échec si note < 50
  } else {
    return `${mark} ✓`; // Réussi si note ≥ 50
  }
};

/**
 * Trie les projets par date de création (plus récent en premier)
 */
export const sortProjectsByDate = (projects: ProjectUser[]): ProjectUser[] => {
  return [...projects].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

/**
 * Trie les skills par niveau (plus élevé en premier)
 */
export const sortSkillsByLevel = (skills: any[]): any[] => {
  return [...skills].sort((a, b) => b.level - a.level);
};

/**
 * Vérifie si une chaîne est un email valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calcule l'âge en jours depuis une date
 */
export const daysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
