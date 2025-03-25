import {
  PlaneAPIResponse,
  PlaneWorkspace,
  PlaneProject,
  PlaneState,
  PlaneCycle,
  PlaneModule,
  PlaneIssue,
  PlaneComment,
  CreateIssueData,
  UpdateIssueData,
  CreateCommentData
} from './types.js';

interface ApiOptions {
  apiKey: string;
  baseUrl: string;
  workspaceSlug: string;
}

export class PlaneApiClient {
  private apiKey: string;
  private baseUrl: string;
  private workspaceSlug: string;

  constructor(options: ApiOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
    this.workspaceSlug = options.workspaceSlug;
  }

  /**
   * Makes API calls to the Plane API
   */
  private async callPlaneAPI<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      }
    };
    
    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unknown error';
      }
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    // For DELETE requests that return 204 No Content
    if (response.status === 204) {
      return { success: true } as unknown as T;
    }
    
    return await response.json();
  }

  /**
   * Get workspace details
   */
  async getWorkspace(): Promise<PlaneWorkspace> {
    return this.callPlaneAPI<PlaneWorkspace>(`/api/v1/workspaces/${this.workspaceSlug}/`, 'GET');
  }

  /**
   * List all workspaces 
   */
  async listWorkspaces(): Promise<PlaneWorkspace[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneWorkspace>>('/api/v1/workspaces/', 'GET');
    return response.results || [];
  }

  /**
   * List all projects in a workspace
   */
  async listProjects(): Promise<PlaneProject[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneProject>>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/`, 
      'GET'
    );
    return response.results || [];
  }

  /**
   * Get project details by ID
   */
  async getProject(projectId: string): Promise<PlaneProject> {
    return this.callPlaneAPI<PlaneProject>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/`, 
      'GET'
    );
  }

  /**
   * Get all states in a project
   */
  async getProjectStates(projectId: string): Promise<PlaneState[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneState>>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/states/`, 
      'GET'
    );
    return response.results || [];
  }

  /**
   * List all cycles in a project
   */
  async listCycles(projectId: string): Promise<PlaneCycle[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneCycle>>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/cycles/`, 
      'GET'
    );
    return response.results || [];
  }

  /**
   * Get cycle details
   */
  async getCycle(projectId: string, cycleId: string): Promise<PlaneCycle> {
    return this.callPlaneAPI<PlaneCycle>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/cycles/${cycleId}/`, 
      'GET'
    );
  }

  /**
   * List all modules in a project
   */
  async listModules(projectId: string): Promise<PlaneModule[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneModule>>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/modules/`, 
      'GET'
    );
    return response.results || [];
  }

  /**
   * Get module details
   */
  async getModule(projectId: string, moduleId: string): Promise<PlaneModule> {
    return this.callPlaneAPI<PlaneModule>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/modules/${moduleId}/`, 
      'GET'
    );
  }

  /**
   * List issues from a project
   */
  async listIssues(projectId: string, filters?: Record<string, any>): Promise<PlaneIssue[]> {
    let endpoint = `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/`;
    
    // Add query parameters for filtering
    if (filters && Object.keys(filters).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }
    
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneIssue>>(endpoint, 'GET');
    return response.results || [];
  }

  /**
   * Get issue details
   */
  async getIssue(projectId: string, issueId: string): Promise<PlaneIssue> {
    return this.callPlaneAPI<PlaneIssue>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/${issueId}/`, 
      'GET'
    );
  }

  /**
   * Create a new issue
   */
  async createIssue(projectId: string, issueData: CreateIssueData): Promise<PlaneIssue> {
    return this.callPlaneAPI<PlaneIssue>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/`, 
      'POST',
      issueData
    );
  }

  /**
   * Update an existing issue
   */
  async updateIssue(projectId: string, issueId: string, updateData: UpdateIssueData): Promise<PlaneIssue> {
    return this.callPlaneAPI<PlaneIssue>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/${issueId}/`, 
      'PATCH',
      updateData
    );
  }

  /**
   * Delete an issue
   */
  async deleteIssue(projectId: string, issueId: string): Promise<{success: boolean}> {
    return this.callPlaneAPI<{success: boolean}>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/${issueId}/`, 
      'DELETE'
    );
  }

  /**
   * List comments for an issue
   */
  async listIssueComments(projectId: string, issueId: string): Promise<PlaneComment[]> {
    const response = await this.callPlaneAPI<PlaneAPIResponse<PlaneComment>>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/`, 
      'GET'
    );
    return response.results || [];
  }

  /**
   * Add a comment to an issue
   */
  async addIssueComment(projectId: string, issueId: string, commentData: CreateCommentData): Promise<PlaneComment> {
    return this.callPlaneAPI<PlaneComment>(
      `/api/v1/workspaces/${this.workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/`, 
      'POST',
      commentData
    );
  }
} 