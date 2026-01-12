import { NextResponse } from 'next/server';
import { mockMCPQuery } from '@/lib/mocks';
import { MCPQueryRequest, MCPQueryResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: MCPQueryRequest = await request.json();
    const { answer, exploreUsed } = await mockMCPQuery(body.question);

    const response: MCPQueryResponse = {
      success: true,
      answer,
      exploreUsed,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao processar query' },
      { status: 500 }
    );
  }
}
