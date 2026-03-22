export interface PersonImage {
  image_url: string | null;
}

export interface PersonImages {
  jpg?: PersonImage;
  webp?: PersonImage;
}

export interface PersonMeta {
  mal_id: number;
  url: string;
  images: PersonImages;
  name: string;
}

export interface PersonAnimeStaff {
  position: string;
  anime: {
    mal_id: number;
    url: string;
    images: PersonImages;
    title: string;
  };
}

export interface PersonMangaStaff {
  position: string;
  manga: {
    mal_id: number;
    url: string;
    images: PersonImages;
    title: string;
  };
}

export interface PersonVoiceRole {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: PersonImages;
    title: string;
  };
  character: {
    mal_id: number;
    url: string;
    images: PersonImages;
    name: string;
  };
}

export interface Person {
  mal_id: number;
  url: string;
  website_url: string | null;
  images: PersonImages;
  name: string;
  given_name: string | null;
  family_name: string | null;
  alternate_names: string[];
  birthday: string | null;
  favorites: number;
  about: string | null;
}

export interface PersonFull extends Person {
  anime: PersonAnimeStaff[];
  manga: PersonMangaStaff[];
  voices: PersonVoiceRole[];
}

export interface PersonAnime {
  data: PersonAnimeStaff[];
}

export interface PersonManga {
  data: PersonMangaStaff[];
}

export interface PersonVoiceActingRoles {
  data: PersonVoiceRole[];
}

export interface PersonPictures {
  data: Array<{
    image_url: string | null;
    large_image_url: string | null;
  }>;
}

export interface PeopleSearch {
  data: Person[];
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface CharacterVoiceActor {
  language: string;
  person: PersonMeta;
}

export interface CharacterVoiceActors {
  data: CharacterVoiceActor[];
}

export interface AnimeStaff {
  data: Array<{
    person: PersonMeta;
    positions: string[];
  }>;
}