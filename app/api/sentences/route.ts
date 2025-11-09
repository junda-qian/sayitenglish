import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeChecked = searchParams.get('includeChecked') === 'true';

    const sentences = await prisma.sentencePair.findMany({
      where: includeChecked ? {} : { isChecked: false },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sentences);
  } catch (error) {
    console.error('Error fetching sentences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'number') {
      return NextResponse.json(
        { error: 'Sentence ID is required' },
        { status: 400 }
      );
    }

    await prisma.sentencePair.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sentence:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
