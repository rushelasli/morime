# Morime

A modern anime and manga discovery platform built with Next.js 16, React 19, and TypeScript. Powered by the Jikan API v4 through a custom TypeScript wrapper.

## Overview

Morime provides a clean, fast interface for browsing anime and manga. It integrates with MyAnimeList data through the Jikan API using [@rushelasli/jikants](https://www.npmjs.com/package/@rushelasli/jikants), a fully-typed TypeScript wrapper.

## Features

### Content Discovery
- Browse anime by status (airing, completed, upcoming)
- Top anime rankings with multiple filter types
- Seasonal anime archives (current, past, upcoming)
- Weekly airing schedules by day
- Genre-based filtering for anime and manga
- Advanced search with multiple parameters
- Producer and studio catalogs

### Detailed Information
- Comprehensive anime and manga detail pages
- Character listings with voice actors
- Episode information and tracking
- Related content and recommendations
- YouTube trailer integration
- Staff and production information

### User Experience
- Dark mode support with system preference detection
- Fully responsive design
- SFW content filtering
- Optimized image loading with fallbacks
- Server-side rendering for fast initial loads
- 24-hour API response caching

## Tech Stack

**Core:**
- Next.js 16 (App Router with React Server Components)
- React 19
- TypeScript 5.9
- Bun (package manager and runtime)

**Styling:**
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- next-themes for dark mode

**Data & API:**
- [@rushelasli/jikants](https://www.npmjs.com/package/@rushelasli/jikants) - Jikan API wrapper
- Built-in request caching (24-hour TTL)
- Automatic rate limiting (3 req/sec)

**Additional:**
- Embla Carousel for home page
- Vercel Analytics integration
- class-variance-authority for component variants

## Getting Started

### Prerequisites

- Bun 1.0 or higher
- Node.js 18+ (for compatibility)

### Installation

Install dependencies:

```bash
bun install
```

### Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Create a production build:

```bash
bun run build
```

### Production

Start the production server:

```bash
bun start
```

## Project Structure

```
morime/
├── src/
│   ├── actions/              # Server actions (cookies, etc.)
│   ├── app/                  # Next.js App Router pages
│   │   ├── anime/           # Anime-related routes
│   │   ├── manga/           # Manga-related routes
│   │   └── producer/        # Studio/producer routes
│   ├── components/          # React components
│   │   ├── anime/           # Anime-specific components
│   │   ├── manga/           # Manga-specific components
│   │   ├── producer/        # Producer components
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── display/         # Display components (cards, grids)
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   ├── loading/         # Loading skeletons
│   │   └── navigation/      # Navigation components
│   ├── hooks/               # API integration hooks
│   │   ├── useAnime.ts      # Anime operations
│   │   ├── useManga.ts      # Manga operations
│   │   ├── useSeason.ts     # Seasonal anime
│   │   ├── useSchedule.ts   # Airing schedules
│   │   └── useProducer.ts   # Producer/studio data
│   ├── lib/                 # Utilities and helpers
│   │   ├── api/             # API client configuration
│   │   │   ├── jikan.ts     # Jikan client setup
│   │   │   ├── client.ts    # Client factory
│   │   │   └── adapters.ts  # Type adapters
│   │   └── utils/           # Utility functions
│   │       ├── TitleExtractor.ts  # Title handling
│   │       ├── ImageFallback.ts   # Image utilities
│   │       ├── Formatter.ts       # Text formatting
│   │       ├── Youtube.ts         # YouTube helpers
│   │       ├── Season.ts          # Season utilities
│   │       └── Cn.ts             # Class name helper
│   └── types/               # TypeScript definitions
│       ├── anime.ts         # Anime/manga types
│       ├── components.ts    # Component prop types
│       └── pages.ts         # Page prop types
└── public/                  # Static assets
```

## API Integration

### jikants Package

This project uses [@rushelasli/jikants](https://www.npmjs.com/package/@rushelasli/jikants), a modern TypeScript wrapper for Jikan API v4.

**Key features:**
- Full TypeScript support with 100% type coverage
- Built-in HTTP caching (24-hour TTL)
- Automatic rate limiting (3 req/sec)
- 101 Jikan API endpoints covered
- Tree-shaking friendly
- Zero configuration required

### Client Configuration

The Jikan client is configured in `src/lib/api/jikan.ts`:

```typescript
import { JikanClient } from '@rushelasli/jikants';

const jikanClient = new JikanClient({
  cacheOptions: {
    ttl: 1000 * 60 * 60 * 24, // 24 hours
  },
  enableLogging: process.env.NODE_ENV === 'development',
});

export const animeClient = jikanClient.anime;
export const mangaClient = jikanClient.manga;
export const seasonsClient = jikanClient.seasons;
export const schedulesClient = jikanClient.schedules;
export const producersClient = jikanClient.producers;
```

### Custom Hooks

API operations are abstracted through custom hooks for clean server component integration:

**useAnime.ts** - Anime operations
- `getAnime()` - Fetch anime with filters
- `getTopAnime()` - Top-rated anime
- `getDetailAnime()` - Full anime details
- `getAnimeCharacters()` - Character data
- `getEpisodeAnime()` - Episode listings
- `searchAnime()` - Search functionality
- `getAnimeGenresList()` - Genre list
- `getRecentlyCompletedAnime()` - Recently finished anime

**useManga.ts** - Manga operations
- `getManga()` - Fetch manga with filters
- `getTopManga()` - Top-rated manga
- `getDetailManga()` - Full manga details
- `getMangaCharacters()` - Character data
- `searchManga()` - Search functionality
- `getMangaGenresList()` - Genre list

**useSeason.ts** - Seasonal anime
- `getSeason()` - Current/upcoming/past seasons
- `getSeasonList()` - Season archive

**useSchedule.ts** - Airing schedules
- `getSchedules()` - Weekly schedule by day

**useProducer.ts** - Studios and producers
- `getProducers()` - List producers
- `getProducerById()` - Studio details
- `getProducerAnime()` - Anime by producer
- `searchProducers()` - Search producers

### Usage Example

```typescript
// Server component example
import { getTopAnime } from '@/hooks/useAnime';

export default async function TopAnimePage() {
  const { data, totalPages } = await getTopAnime(1, { 
    limit: 24,
    sfw: true 
  });

  return (
    <div>
      {data.map(anime => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
```

## Recent Improvements

### Code Refactoring (March 2025)
- Migrated from custom API utilities to [@rushelasli/jikants](https://www.npmjs.com/package/@rushelasli/jikants) package
- Renamed all hooks from PascalCase to camelCase (UseAnime.ts -> useAnime.ts)
- Removed legacy API configuration files (Config.ts, Utils.ts, Cookies.ts)
- Created centralized API client configuration
- Added type adapters for seamless integration

### Title Handling
- Implemented TitleExtractor utility to handle Jikan's titles array
- Replaced deprecated title fields (title, title_english, title_japanese)
- Added smart fallback logic for missing translations
- Zero TypeScript deprecation warnings

### Type Safety
- Achieved 100% TypeScript coverage
- Fixed all implicit 'any' types
- Added proper typing to all components and hooks
- Removed unused imports and variables
- Clean build with zero errors/warnings

### SFW Content Filtering
- Implemented cookie-based SFW preference storage
- Added SFW toggle in navigation
- Integrated SFW parameter across all API calls
- Smart page reload logic to prevent unnecessary API calls
- Request deduplication using React cache()

### Performance Optimization
- Added server-side request caching (React cache)
- Implemented image fallback system
- Optimized skeleton loading states
- Reduced duplicate API calls on page navigation
- Smart routing to preserve search parameters

### Component Architecture
- Created reusable PageContainer and PageHeader components
- Separated search results into dedicated components
- Improved loading skeleton accuracy
- Enhanced empty state handling
- Better error boundary coverage

### Developer Experience
- Cleaned up package.json (removed unused dependencies)
- Updated all packages to latest versions
- Simplified environment configuration
- Removed temporary documentation files
- Added comprehensive .gitignore rules

## Utilities

### TitleExtractor (`src/lib/utils/TitleExtractor.ts`)
Handles title extraction from Jikan's titles array:

```typescript
import { getTitle, getEnglishTitle, getJapaneseTitle } from '@/lib/utils/TitleExtractor';

const title = getTitle(anime.titles);           // Primary title
const english = getEnglishTitle(anime.titles);  // English or null
const japanese = getJapaneseTitle(anime.titles); // Japanese or null
```

### YouTube (`src/lib/utils/Youtube.ts`)
YouTube integration helpers:

```typescript
import { getYouTubeThumbnail } from '@/lib/utils/Youtube';

const thumbnail = getYouTubeThumbnail(embedUrl, 'maxres');
```

### Formatter (`src/lib/utils/Formatter.ts`)
Text and date formatting:

```typescript
import { toSnakeCase, formatEstablishedDate } from '@/lib/utils/Formatter';

const slug = toSnakeCase('Attack on Titan'); // attack_on_titan
const date = formatEstablishedDate('1995-10-10'); // Oct 10, 1995
```

## Styling

Tailwind CSS 4 with custom configuration:
- Custom color palette
- Dark mode via next-themes
- Responsive breakpoints
- Animation utilities (tw-animate-css)
- Radix UI component primitives

## Caching Strategy

### API Response Caching
jikants automatically caches all API responses for 24 hours using axios-cache-interceptor. This:
- Reduces API load
- Improves response times
- Helps stay within rate limits
- Works seamlessly across the app

### Next.js Caching
- Server components are cached by default
- Static pages are pre-rendered
- ISR (Incremental Static Regeneration) for dynamic content
- Client-side navigation caching

## Rate Limiting

**Jikan API Limits:**
- 3 requests per second
- 60 requests per minute

The jikants package handles rate limiting automatically. The 24-hour cache ensures most requests are served from cache, staying well within limits.

## Environment Variables

No environment variables are required. The application works out of the box.

Optional configuration:

```env
# Next.js automatically sets NODE_ENV
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Deployment

Optimized for Vercel deployment:
- Built-in Vercel Analytics
- Speed Insights integration
- Automatic image optimization
- Edge runtime support
- Zero configuration needed

Deploy with:
```bash
vercel --prod
```

## Performance

- Lighthouse score: 90+ on all metrics
- First Contentful Paint: Under 1.5s
- Time to Interactive: Under 3s
- Optimized images with Next.js Image
- Lazy loading for below-fold content
- Code splitting with dynamic imports

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [Jikan API Documentation](https://docs.api.jikan.moe/)
- [jikants Package](https://www.npmjs.com/package/@rushelasli/jikants)
- [jikants GitHub](https://github.com/rushelasli/jikants)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

## Contributing

Contributions are welcome. Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This is a private project. All rights reserved.

## Acknowledgments

- [Jikan API](https://jikan.moe/) for providing free MyAnimeList data
- [@rushelasli/jikants](https://github.com/rushelasli/jikants) for the excellent TypeScript wrapper
- MyAnimeList for the original data source
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Vercel](https://vercel.com/) for hosting and deployment platform