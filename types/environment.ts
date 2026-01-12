export type Explore = 'finance_transactions' | 'ab_inventory' | 'marketing_campaigns';

export interface Environment {
  id: string;
  name: string;
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  createdBy: string;
  explores: Explore[];
  users: string[];
}

export interface EnvironmentUser {
  id: string;
  lookerUser: string;
  role: 'user' | 'admin';
  environmentId: string;
}
