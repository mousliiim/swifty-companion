export interface User {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  displayname: string;
  phone: string;
  location: string | null;
  wallet: number;
  correction_point: number;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
  campus: Campus[];
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
}

export interface Campus {
  id: number;
  name: string;
  time_zone: string;
  country: string;
  city: string;
  language: {
    id: number;
    name: string;
    identifier: string;
  };
}

export interface CursusUser {
  id: number;
  begin_at: string;
  end_at: string | null;
  grade: string | null;
  level: number;
  skills: Skill[];
  cursus_id: number;
  cursus: {
    id: number;
    name: string;
    slug: string;
    kind: string;
  };
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: 'finished' | 'in_progress' | 'waiting_for_correction' | 'searching_a_group';
  'validated?': boolean | null;
  cursus_ids: number[];
  project: {
    id: number;
    name: string;
    slug: string;
  };
  marked_at: string | null;
  marked: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
  secret_valid_until?: number;
}

export interface TokenInfo {
  resource_owner_id: number | null;
  scopes: string[];
  expires_in_seconds: number;
  application: {
    uid: string;
  };
  created_at: number;
}
