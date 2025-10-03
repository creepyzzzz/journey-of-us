# Supabase Integration Setup

This document explains how to set up the Supabase integration for the Journey of Us application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eovuittsawkgrsqykolc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdnVpdHRzYXdrZ3JzcXlrb2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODU0NTQsImV4cCI6MjA3NTA2MTQ1NH0.x4izfmjlytB2uO1yjYnAdzDlzhwXq2-OTYV5d50x6h4
```

## Database Schema

The following tables have been created in your Supabase project:

### 1. `games` table
- Stores all game content including truths, dares, secrets, memories, etc.
- Includes publishing information (slug, love_code, visibility)
- Automatically updates `updated_at` timestamp

### 2. `game_sessions` table
- Tracks individual play sessions
- Links to games via foreign key
- Stores player progress and answers

### 3. `player_answers` table
- Stores individual player answers
- Links to both games and sessions
- Includes metadata for scoring and analytics

### 4. `game_analytics` table
- Automatically updated analytics for each game
- Tracks total plays, completion rate, average play time
- Updated via database triggers

## Features Implemented

### ✅ Database Migration
- All tables created with proper relationships
- Row Level Security (RLS) enabled
- Automatic timestamp updates
- Analytics triggers

### ✅ Supabase Client Setup
- Type-safe database client
- Environment variable configuration
- Error handling

### ✅ Storage Layer
- Complete replacement of local storage
- CRUD operations for all data types
- Support for fetching by slug and love code

### ✅ Store Integration
- Updated Zustand stores to use Supabase
- New Supabase-specific store with additional features
- Backward compatibility maintained

### ✅ Component Updates
- Home page uses Supabase store
- Editor page uses Supabase store
- Play page fetches games by slug/love code
- Publish dialog uses new publishing functionality

## Usage

### Creating Games
```typescript
const { setCurrentGame, saveGame } = useSupabaseGameStore();
const newGame = createEmptyGame("My Journey");
setCurrentGame(newGame);
await saveGame();
```

### Publishing Games
```typescript
const { publishGame } = useSupabaseGameStore();
const result = await publishGame(gameId, "link", {
  generateAccessCode: true
});
// Returns { slug: "abc123", loveCode: "XYZ789" }
```

### Fetching Games
```typescript
const { getGameBySlug, getGameByLoveCode } = useSupabaseGameStore();
const game = await getGameBySlug("abc123");
const gameByCode = await getGameByLoveCode("XYZ789");
```

## Security

- Row Level Security (RLS) is enabled on all tables
- Public read access for published games
- Anyone can create/update/delete games (can be restricted later)
- Analytics are read-only for users

## Analytics

The system automatically tracks:
- Total number of plays per game
- Completion rate
- Average play time
- Most popular level
- Last played timestamp

Analytics are updated automatically via database triggers when sessions are completed.

## Next Steps

1. Set up the environment variables
2. Test the application functionality
3. Consider adding user authentication for better security
4. Implement rate limiting for public games
5. Add more detailed analytics and reporting

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**: Make sure `.env.local` is in the project root and restart the development server.

2. **Database connection errors**: Verify the Supabase URL and anon key are correct.

3. **RLS policy errors**: Check that the policies are properly set up in the Supabase dashboard.

4. **Type errors**: Make sure the database types in `lib/supabase.ts` match your actual database schema.
