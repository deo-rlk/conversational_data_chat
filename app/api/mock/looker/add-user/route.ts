import { NextResponse } from 'next/server';
import { mockAddUser } from '@/lib/mocks';
import { AddUserRequest, AddUserResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: AddUserRequest = await request.json();
    const result = await mockAddUser(body.environmentId, body.lookerUser);

    const response: AddUserResponse = {
      success: true,
      role: result.role,
      userId: result.userId,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao adicionar usuário' },
      { status: 500 }
    );
  }
}
