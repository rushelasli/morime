"use server";
import { searchAnime } from "@/hooks/useAnime";
import { searchManga } from "@/hooks/useManga";
import { searchCharacters } from "@/hooks/useCharacter";
import { getSfwCookie } from "@/actions/CookieActions";

export async function globalSearch(query: string) {
  if (!query || query.length < 3) return null;
  const isSfw = await getSfwCookie();

  try {
    const [anime, manga, chars] = await Promise.all([
      searchAnime(query, 1, 5, isSfw),
      searchManga(query, 1, 5, isSfw),
      searchCharacters(query, 1, { limit: 5 }),
    ]);

    return {
      anime: anime.data || [],
      manga: manga.data || [],
      characters: chars.data || [],
    };
  } catch (error) {
    console.error("Global search error:", error);
    return null;
  }
}
