"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Separator } from "@/components/ui/Separator";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon } from "lucide-react";
import { SectionCard } from "@/components/anime/detail/SectionCard";
import Image from "next/image";
import Link from "next/link";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { CharacterAnimeRole, CharacterMangaRole, CharacterVoiceActorRole } from "@/types/character";

const TabSeparator = () => (
  <div className="-mx-1 md:hidden">
    <Separator className="w-full" />
  </div>
);

interface ContentSectionsData {
  animeData?: {
    data: CharacterAnimeRole[];
    totalPages?: number;
  } | null;
  mangaData?: {
    data: CharacterMangaRole[];
    totalPages?: number;
  } | null;
  voicesData?: {
    data: CharacterVoiceActorRole[];
    totalPages?: number;
  } | null;
  about?: string | null;
}

interface CharacterContentSectionsProps {
  contentData: ContentSectionsData;
}

export function CharacterContentSections({
  contentData,
}: CharacterContentSectionsProps) {
  const { animeData, mangaData, voicesData, about } = contentData;

  const [visibleAnime, setVisibleAnime] = useState(16);
  const [visibleManga, setVisibleManga] = useState(16);
  const [visibleVoices, setVisibleVoices] = useState(16);

  const displayAnime = animeData?.data?.slice(0, visibleAnime) || [];
  const displayManga = mangaData?.data?.slice(0, visibleManga) || [];
  const displayVoices = voicesData?.data?.slice(0, visibleVoices) || [];

  const hasMoreAnime = (animeData?.data?.length || 0) > visibleAnime;
  const hasMoreManga = (mangaData?.data?.length || 0) > visibleManga;
  const hasMoreVoices = (voicesData?.data?.length || 0) > visibleVoices;

  return (
    <div className="space-y-6 sm:space-y-8">
      {about && (
        <SectionCard title="Biography">
          <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
            {about}
          </p>
        </SectionCard>
      )}

      <SectionCard title="Appearances & Voice Actors">
        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10 gap-1 md:gap-0 p-1 md:p-0 mb-6 bg-muted/30 md:bg-muted">
            <TabsTrigger value="anime" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Animeography
            </TabsTrigger>
            <TabSeparator />
            <TabsTrigger value="manga" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Mangaography
            </TabsTrigger>
            <TabSeparator />
            <TabsTrigger value="voice" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Voice Actors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anime" className="mt-4">
            {animeData && animeData.data && animeData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {displayAnime.map((animeItem: CharacterAnimeRole, i: number) => (
                    <div key={`anime-${animeItem?.anime?.mal_id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                      <Link href={`/anime/${animeItem?.anime?.mal_id}/${toSnakeCase(animeItem?.anime?.title || "unknown")}`} className="shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={animeItem?.anime?.images?.webp?.image_url || animeItem?.anime?.images?.jpg?.image_url || "/placeholder-anime.png"}
                          alt={animeItem?.anime?.title || "Anime"}
                          width={48}
                          height={64}
                          className="object-cover shadow-sm h-16 w-12 transition-transform duration-300 group-hover:scale-110"
                          placeholder="empty"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Link href={`/anime/${animeItem?.anime?.mal_id}/${toSnakeCase(animeItem?.anime?.title || "unknown")}`}>
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {animeItem?.anime?.title || "Unknown Anime"}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground font-medium">{animeItem?.role || "Character"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMoreAnime && (
                  <Button variant="outline" className="w-full" onClick={() => setVisibleAnime(prev => prev + 16)}>
                    <ChevronDownIcon className="h-4 w-4 mr-2" />
                    Show More ({animeData.data.length - visibleAnime} remaining)
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">No anime appearances available</div>
            )}
          </TabsContent>

          <TabsContent value="manga" className="mt-4">
            {mangaData && mangaData.data && mangaData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {displayManga.map((mangaItem: CharacterMangaRole, i: number) => (
                    <div key={`manga-${mangaItem?.manga?.mal_id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                      <Link href={`/manga/${mangaItem?.manga?.mal_id}/${toSnakeCase(mangaItem?.manga?.title || "unknown")}`} className="shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={mangaItem?.manga?.images?.webp?.image_url || mangaItem?.manga?.images?.jpg?.image_url || "/placeholder-manga.png"}
                          alt={mangaItem?.manga?.title || "Manga"}
                          width={48}
                          height={64}
                          className="object-cover shadow-sm h-16 w-12 transition-transform duration-300 group-hover:scale-110"
                          placeholder="empty"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Link href={`/manga/${mangaItem?.manga?.mal_id}/${toSnakeCase(mangaItem?.manga?.title || "unknown")}`}>
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {mangaItem?.manga?.title || "Unknown Manga"}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground font-medium">{mangaItem?.role || "Character"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMoreManga && (
                  <Button variant="outline" className="w-full" onClick={() => setVisibleManga(prev => prev + 16)}>
                    <ChevronDownIcon className="h-4 w-4 mr-2" />
                    Show More ({mangaData.data.length - visibleManga} remaining)
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">No manga appearances available</div>
            )}
          </TabsContent>

          <TabsContent value="voice" className="mt-4">
            {voicesData && voicesData.data && voicesData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {displayVoices.map((voice: CharacterVoiceActorRole, i: number) => (
                    <div
                      key={`voice-${voice?.person?.mal_id}-${i}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group"
                    >
                      <Link href={`/people/${voice?.person?.mal_id}/${toSnakeCase(voice?.person?.name || "unknown")}`} className="shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={voice?.person?.images?.jpg?.image_url || "/placeholder-character.png"}
                          alt={voice?.person?.name || "Person"}
                          width={48}
                          height={64}
                          className="object-cover shadow-sm h-16 w-12 transition-transform duration-300 group-hover:scale-110"
                          placeholder="empty"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Link href={`/people/${voice?.person?.mal_id}/${toSnakeCase(voice?.person?.name || "unknown")}`}>
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {voice?.person?.name || "Unknown Voice Actor"}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground font-medium">{voice?.language || "Language"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMoreVoices && (
                  <Button variant="outline" className="w-full" onClick={() => setVisibleVoices(prev => prev + 16)}>
                    <ChevronDownIcon className="h-4 w-4 mr-2" />
                    Show More ({voicesData.data.length - visibleVoices} remaining)
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">No voice actors available</div>
            )}
          </TabsContent>
        </Tabs>
      </SectionCard>
    </div>
  );
}
