# Say It English

An English learning app for Japanese speakers that helps you practice speaking English by translating Japanese sentences.

## Features

- **Voice Input**: Speak Japanese sentences and get instant English translations
- **AI Translation**: Uses OpenAI GPT-4 for natural, conversational English translations
- **Practice Mode**: Random flashcard-style practice with your saved sentences
- **Progress Tracking**: Mark sentences as practiced with checkboxes
- **Simple & Fast**: Clean UI, works on any device with a modern browser

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **SQLite** - Local database
- **OpenAI API** - Translation
- **Web Speech API** - Voice recognition (built into modern browsers)

## Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Modern browser (Chrome or Edge recommended for best voice recognition support)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and add your OpenAI API key:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## How to Use

### Adding Sentences

1. Click "Add New Sentences" on the home page
2. Click the microphone button
3. Speak a Japanese sentence
4. The app will automatically translate it to English and save it to the database

### Practicing

1. Click "Practice English" on the home page
2. View your sentence list
3. (Optional) Check "Include checked sentences" to practice all sentences
4. Click "Start Practice"
5. Read the Japanese sentence and try to translate it to English in your head
6. Click "Show Answer" to see the English translation
7. Mark as practiced or move to the next card

## Browser Compatibility

**Voice Recognition Works Best On:**
- Chrome (Desktop & Mobile)
- Edge
- Safari (iOS 14.5+)

**Note**: Firefox does not support Web Speech API for speech recognition.

## Cost Estimate

Using OpenAI GPT-4:
- Approximately $0.01 per 30-40 translations
- Very affordable for personal use

## Project Structure

```
sayitenglish/
├── app/
│   ├── api/
│   │   ├── translate/      # Translation API route
│   │   └── sentences/      # CRUD operations for sentences
│   ├── input/              # Voice input page
│   ├── practice/           # Practice page
│   └── page.tsx            # Home page
├── lib/
│   └── prisma.ts           # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── .env                    # Environment variables
```

## Database Schema

```prisma
model SentencePair {
  id        Int      @id @default(autoincrement())
  japanese  String
  english   String
  isChecked Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` to environment variables in Vercel
4. Deploy!

**Note**: For production, consider upgrading from SQLite to PostgreSQL (Vercel provides free PostgreSQL through Neon).

### Option 2: Local Network

Run on your local network to access from phone/tablet:

```bash
npm run dev -- -H 0.0.0.0
```

Then access via `http://YOUR_LOCAL_IP:3000` from other devices on your network.

## Troubleshooting

### Voice recognition not working
- Ensure you're using Chrome or Edge
- Check that microphone permissions are granted
- Try using HTTPS (required for voice recognition in some browsers)

### Translation errors
- Verify your OpenAI API key is correct in `.env`
- Check that you have credits in your OpenAI account
- Look at terminal logs for detailed error messages

### Database errors
- Delete `prisma/dev.db` and run `npx prisma migrate dev` to recreate the database

## Future Enhancements

Possible improvements:
- Text-to-speech for English pronunciation
- Spaced repetition algorithm
- Statistics and progress tracking
- Categories/tags for sentences
- Export/import functionality
- Mobile app version

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
