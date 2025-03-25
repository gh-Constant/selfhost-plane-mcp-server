export interface PlaneWorkspace {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface PlaneProject {
  id: string;
  name: string;
  identifier: string;
  description?: string;
  [key: string]: any;
}

export interface PlaneState {
  id: string;
  name: string;
  color: string;
  group: string;
  [key: string]: any;
}

export interface PlaneCycle {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export interface PlaneModule {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface PlaneIssue {
  id: string;
  name: string;
  description_html?: string;
  state: string;
  priority?: string;
  assignees?: string[];
  [key: string]: any;
}

export interface PlaneComment {
  id: string;
  comment_html: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface PlaneAPIResponse<T> {
  results?: T[];
  count?: number;
  total_pages?: number;
  next_cursor?: string;
  prev_cursor?: string;
  [key: string]: any;
}

export interface CreateIssueData {
  name: string;
  description_html?: string;
  priority?: string;
  state?: string;
  assignees?: string[];
  labels?: string[];
  [key: string]: any;
}

export interface UpdateIssueData {
  name?: string;
  description_html?: string;
  priority?: string;
  state?: string;
  assignees?: string[];
  labels?: string[];
  [key: string]: any;
}

export interface CreateCommentData {
  comment_html: string;
} 