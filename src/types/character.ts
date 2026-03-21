export interface CharacterImage {
  image_url: string | null;
  small_image_url?: string | null;
  large_image_url?: string | null;
}

export interface CharacterImages {
  jpg?: CharacterImage;
  webp?: CharacterImage;
}

export interface CharacterMeta {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
}

export interface CharacterAnimeRole {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: any;
    title: string;
  };
}

export interface CharacterMangaRole {
  role: string;
  manga: {
    mal_id: number;
    url: string;
    images: any;
    title: string;
  };
}

export interface CharacterVoiceActorRole {
  language: string;
  person: {
    mal_id: number;
    url: string;
    images: any;
    name: string;
  };
}

export interface CharacterData {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  favorites: number;
  about: string | null;
}

export interface CharacterFull extends CharacterData {
  anime: CharacterAnimeRole[];
  manga: CharacterMangaRole[];
  voices: CharacterVoiceActorRole[];
}