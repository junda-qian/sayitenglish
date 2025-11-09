import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { japanese } = await request.json();

    if (!japanese || typeof japanese !== 'string') {
      return NextResponse.json(
        { error: 'Japanese text is required' },
        { status: 400 }
      );
    }

    // Translate using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the following Japanese sentence into natural, conversational English. Only respond with the English translation, nothing else.',
        },
        {
          role: 'user',
          content: japanese,
        },
      ],
      temperature: 0.3,
    });

    const english = completion.choices[0]?.message?.content?.trim();

    if (!english) {
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: 500 }
      );
    }

    // Save to database
    const sentencePair = await prisma.sentencePair.create({
      data: {
        japanese,
        english,
      },
    });

    return NextResponse.json({
      id: sentencePair.id,
      japanese: sentencePair.japanese,
      english: sentencePair.english,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
