import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { englishWord } = await request.json();

    if (!englishWord || typeof englishWord !== 'string') {
      return NextResponse.json(
        { error: 'English word or phrase is required' },
        { status: 400 }
      );
    }

    // Generate ONE natural example sentence with the word/phrase
    const sentenceGeneration = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful English teacher. Create ONE natural, conversational English sentence that uses the given word or phrase. The sentence should be an example of how the word is commonly used in real conversation or speech. Return ONLY the sentence, nothing else.`,
        },
        {
          role: 'user',
          content: englishWord,
        },
      ],
      temperature: 0.7,
    });

    const english = sentenceGeneration.choices[0]?.message?.content?.trim();

    if (!english) {
      return NextResponse.json(
        { error: 'Failed to generate sentence' },
        { status: 500 }
      );
    }

    // Translate the sentence to Japanese
    const translation = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the following English sentence into natural Japanese. Only respond with the Japanese translation, nothing else.',
        },
        {
          role: 'user',
          content: english,
        },
      ],
      temperature: 0.3,
    });

    const japanese = translation.choices[0]?.message?.content?.trim();

    if (!japanese) {
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: 500 }
      );
    }

    // Save to database
    const sentencePair = await prisma.sentencePair.create({
      data: {
        english,
        japanese,
      },
    });

    return NextResponse.json({
      id: sentencePair.id,
      word: englishWord,
      english: sentencePair.english,
      japanese: sentencePair.japanese,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
