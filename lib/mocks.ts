import { Explore } from '@/types/environment';

// Mock delay simulation
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock MCP query response
export async function mockMCPQuery(question: string): Promise<{ answer: string; exploreUsed: Explore }> {
  await delay(500 + Math.random() * 500);
  
  const explores: Explore[] = ['finance_transactions', 'ab_inventory', 'marketing_campaigns'];
  const exploreUsed = explores[Math.floor(Math.random() * explores.length)];
  
  return {
    answer: `Resposta simulada para: "${question}". Este é um mock do MCP. O explore usado foi: ${exploreUsed}.`,
    exploreUsed,
  };
}

// Mock Looker test connection
export async function mockTestConnection(
  instanceUrl: string,
  clientId: string,
  clientSecret: string
): Promise<{ success: boolean; message?: string }> {
  await delay(600 + Math.random() * 400);
  
  // Simulate failure for invalid URLs
  if (instanceUrl.includes('invalid') || clientId.includes('invalid')) {
    return {
      success: false,
      message: 'Falha na conexão. Verifique as credenciais.',
    };
  }
  
  return {
    success: true,
    message: 'Conexão estabelecida com sucesso.',
  };
}

// Mock add user to Looker
export async function mockAddUser(
  environmentId: string,
  lookerUser: string
): Promise<{ role: string; userId: string }> {
  await delay(400 + Math.random() * 300);
  
  return {
    role: 'user',
    userId: `user-${Date.now()}`,
  };
}
