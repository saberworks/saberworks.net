
export interface File {
  id: number;
  user: number;
  project: number;
  name: string;
  version: string;
  description: string;
  image: string;
  file: string;
  file_size: number | null;
  file_hash: string | null;
  created_at: string;
}

export interface Tag {
  id: number;
  type: string;
  tag: string;
}

export interface Project {
  id: number;
  user: number;
  games: Array<String>;
  tags: Array<Tag>;
  name: string;
  slug: string;
  description: string;
  accent_color: string;
  image: string;
  created_at: string;
}
