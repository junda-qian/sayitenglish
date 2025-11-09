import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sentenceId = parseInt(id, 10);

    if (isNaN(sentenceId)) {
      return NextResponse.json(
        { error: 'Invalid sentence ID' },
        { status: 400 }
      );
    }

    const { isChecked } = await request.json();

    if (typeof isChecked !== 'boolean') {
      return NextResponse.json(
        { error: 'isChecked must be a boolean' },
        { status: 400 }
      );
    }

    const updated = await prisma.sentencePair.update({
      where: { id: sentenceId },
      data: { isChecked },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating sentence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
