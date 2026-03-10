import { Title } from "@/types/anime";

/**
 * Extracts the most appropriate title from Jikan's titles array.
 * Prefers English titles, falls back to Default/Romaji, then Japanese.
 * 
 * @param titles - Array of title objects from Jikan API
 * @param preferredType - Preferred title type ('English', 'Japanese', 'Default', etc.)
 * @returns The extracted title string
 */
export function getTitle(
  titles: Title[] | undefined,
  preferredType: "English" | "Japanese" | "Default" = "English"
): string {
  if (!titles || titles.length === 0) {
    return "Unknown Title";
  }

  // Try to find the preferred type first
  const preferred = titles.find(
    (t) => t.type.toLowerCase() === preferredType.toLowerCase()
  );
  if (preferred?.title) {
    return preferred.title;
  }

  // Fallback hierarchy based on preferredType
  if (preferredType === "English") {
    // For English preference: English -> Default -> Japanese -> Any
    const defaultTitle = titles.find(
      (t) => t.type.toLowerCase() === "default"
    );
    if (defaultTitle?.title) {
      return defaultTitle.title;
    }

    const japaneseTitle = titles.find(
      (t) => t.type.toLowerCase() === "japanese"
    );
    if (japaneseTitle?.title) {
      return japaneseTitle.title;
    }
  } else if (preferredType === "Japanese") {
    // For Japanese preference: Japanese -> Default -> English -> Any
    const defaultTitle = titles.find(
      (t) => t.type.toLowerCase() === "default"
    );
    if (defaultTitle?.title) {
      return defaultTitle.title;
    }

    const englishTitle = titles.find(
      (t) => t.type.toLowerCase() === "english"
    );
    if (englishTitle?.title) {
      return englishTitle.title;
    }
  } else {
    // For Default preference: Default -> English -> Japanese -> Any
    const englishTitle = titles.find(
      (t) => t.type.toLowerCase() === "english"
    );
    if (englishTitle?.title) {
      return englishTitle.title;
    }

    const japaneseTitle = titles.find(
      (t) => t.type.toLowerCase() === "japanese"
    );
    if (japaneseTitle?.title) {
      return japaneseTitle.title;
    }
  }

  // Final fallback: return the first available title
  return titles[0]?.title || "Unknown Title";
}

/**
 * Extracts the English title from Jikan's titles array.
 * Falls back to Default title if English is not available.
 * 
 * @param titles - Array of title objects from Jikan API
 * @returns The English or Default title string
 */
export function getEnglishTitle(titles: Title[] | undefined): string | null {
  if (!titles || titles.length === 0) {
    return null;
  }

  const englishTitle = titles.find(
    (t) => t.type.toLowerCase() === "english"
  );
  if (englishTitle?.title) {
    return englishTitle.title;
  }

  // Fallback to Default
  const defaultTitle = titles.find((t) => t.type.toLowerCase() === "default");
  return defaultTitle?.title || null;
}

/**
 * Extracts the Japanese title from Jikan's titles array.
 * 
 * @param titles - Array of title objects from Jikan API
 * @returns The Japanese title string or null if not found
 */
export function getJapaneseTitle(titles: Title[] | undefined): string | null {
  if (!titles || titles.length === 0) {
    return null;
  }

  const japaneseTitle = titles.find(
    (t) => t.type.toLowerCase() === "japanese"
  );
  return japaneseTitle?.title || null;
}

/**
 * Extracts title synonyms from Jikan's titles array.
 * Returns all titles that are marked as "Synonym" type.
 * 
 * @param titles - Array of title objects from Jikan API
 * @returns Array of synonym strings
 */
export function getTitleSynonyms(titles: Title[] | undefined): string[] {
  if (!titles || titles.length === 0) {
    return [];
  }

  return titles
    .filter((t) => t.type.toLowerCase() === "synonym")
    .map((t) => t.title)
    .filter(Boolean);
}

/**
 * Gets all available titles as an object with typed keys.
 * Useful for components that need multiple title variants.
 * 
 * @param titles - Array of title objects from Jikan API
 * @returns Object containing all title variants
 */
export function getAllTitles(titles: Title[] | undefined): {
  primary: string;
  english: string | null;
  japanese: string | null;
  synonyms: string[];
} {
  return {
    primary: getTitle(titles),
    english: getEnglishTitle(titles),
    japanese: getJapaneseTitle(titles),
    synonyms: getTitleSynonyms(titles),
  };
}

/**
 * Backward compatibility helper that mimics the old deprecated fields.
 * Use this when migrating from deprecated title/title_english/title_japanese fields.
 * 
 * @param titles - Array of title objects from Jikan API
 * @param titleSynonyms - Optional array of synonym strings (for backward compatibility)
 * @returns Object with title fields matching the old deprecated structure
 */
export function getLegacyTitleFields(
  titles: Title[] | undefined,
  titleSynonyms?: string[]
): {
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
} {
  const synonyms = titleSynonyms || getTitleSynonyms(titles);

  return {
    title: getTitle(titles),
    title_english: getEnglishTitle(titles),
    title_japanese: getJapaneseTitle(titles),
    title_synonyms: synonyms,
  };
}