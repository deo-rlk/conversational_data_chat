export interface MCPQueryRequest {
  question: string;
  environmentId?: string;
}

export interface MCPQueryResponse {
  success: boolean;
  answer: string;
  exploreUsed: string;
}

export interface TestConnectionRequest {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface TestConnectionResponse {
  success: boolean;
  message?: string;
}

export interface AddUserRequest {
  environmentId: string;
  lookerUser: string;
}

export interface AddUserResponse {
  success: boolean;
  role: string;
  userId: string;
}
