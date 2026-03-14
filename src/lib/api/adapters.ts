import type {
  Anime as JikanAnime,
  AnimeFull as JikanAnimeFull,
  AnimeEpisode as JikanAnimeEpisode,
  Manga as JikanManga,
  MangaFull as JikanMangaFull,
  Producer as JikanProducer,
} from "@rushelasli/jikants";
import type { Anime, Manga, Character, Episode } from "@/types/anime";

/**
 * Adapt jikants Anime type to our internal Anime type
 */
export function adaptAnime(jikanAnime: JikanAnime | JikanAnimeFull): Anime {
  return jikanAnime as unknown as Anime;
}

/**
 * Adapt jikants AnimeCharacter to our Character type
 */
export function adaptAnimeCharacter(jikanChar: any): Character {
  return {
    character: {
      mal_id: jikanChar.character.mal_id,
      url: jikanChar.character.url,
      images: jikanChar.character.images,
      name: jikanChar.character.name,
    },
    role: jikanChar.role,
    favorites: jikanChar.favorites,
    voice_actors:
      jikanChar.voice_actors?.map((va: any) => ({
        person: {
          mal_id: va.person.mal_id,
          url: va.person.url,
          images: va.person.images,
          name: va.person.name,
        },
        language: va.language,
      })) || [],
  };
}

/**
 * Adapt jikants AnimeEpisode to our Episode type
 */
export function adaptAnimeEpisode(jikanEpisode: JikanAnimeEpisode): Episode {
  return {
    mal_id: jikanEpisode.mal_id,
    url: jikanEpisode.url,
    title: jikanEpisode.title,
    title_japanese: jikanEpisode.title_japanese || null,
    title_romanji: jikanEpisode.title_romanji || null,
    duration: null,
    aired: jikanEpisode.aired || null,
    filler: jikanEpisode.filler,
    recap: jikanEpisode.recap,
    synopsis: null,
  };
}

/**
 * Adapt array of jikants episodes
 */
export function adaptAnimeEpisodes(jikanEpisodes: JikanAnimeEpisode[]): Episode[] {
  return jikanEpisodes.map(adaptAnimeEpisode);
}

/**
 * Adapt array of jikants characters (works for both anime and manga)
 */
export function adaptAnimeCharacters(jikanChars: any[]): Character[] {
  return jikanChars.map(adaptAnimeCharacter);
}

/**
 * Adapt jikants Manga type to our internal Manga type
 */
export function adaptManga(jikanManga: JikanManga | JikanMangaFull): Manga {
  return jikanManga as unknown as Manga;
}

/**
 * Adapt jikants Producer to our internal ProducerData type
 */
export function adaptProducer(jikanProducer: JikanProducer) {
  return {
    mal_id: jikanProducer.mal_id,
    type: "producers",
    name: jikanProducer.titles?.[0]?.title || "Unknown",
    url: `https://myanimelist.net/anime/producer/${jikanProducer.mal_id}`,
    titles: jikanProducer.titles || [],
    images: jikanProducer.images,
    favorites: jikanProducer.favorites || 0,
    established: jikanProducer.established || null,
    about: jikanProducer.about || null,
    count: jikanProducer.count || 0,
  };
}
