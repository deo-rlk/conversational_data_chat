import { NextResponse } from 'next/server';
import { mockTestConnection } from '@/lib/mocks';
import { TestConnectionRequest, TestConnectionResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: TestConnectionRequest = await request.json();
    const result = await mockTestConnection(
      body.instanceUrl,
      body.clientId,
      body.clientSecret
    );

    const response: TestConnectionResponse = {
      success: result.success,
      message: result.message,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao testar conexão' },
      { status: 500 }
    );
  }
}
