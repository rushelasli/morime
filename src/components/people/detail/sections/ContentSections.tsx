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
import type { PersonAnimeStaff, PersonMangaStaff, PersonVoiceRole } from "@/types/people";

const TabSeparator = () => (
  <div className="-mx-1 md:hidden">
    <Separator className="w-full" />
  </div>
);

interface ContentSectionsData {
  animeData?: {
    data: PersonAnimeStaff[];
    totalPages?: number;
  } | null;
  mangaData?: {
    data: PersonMangaStaff[];
    totalPages?: number;
  } | null;
  voicesData?: {
    data: PersonVoiceRole[];
    totalPages?: number;
  } | null;
  about?: string | null;
}

interface PersonContentSectionsProps {
  contentData: ContentSectionsData;
}

export function PersonContentSections({
  contentData,
}: PersonContentSectionsProps) {
  const { animeData, mangaData, voicesData, about } = contentData;

  const [visibleVoices, setVisibleVoices] = useState(16);
  const [visibleAnime, setVisibleAnime] = useState(16);
  const [visibleManga, setVisibleManga] = useState(16);

  const displayVoices = voicesData?.data?.slice(0, visibleVoices) || [];
  const displayAnime = animeData?.data?.slice(0, visibleAnime) || [];
  const displayManga = mangaData?.data?.slice(0, visibleManga) || [];

  const hasMoreVoices = (voicesData?.data?.length || 0) > visibleVoices;
  const hasMoreAnime = (animeData?.data?.length || 0) > visibleAnime;
  const hasMoreManga = (mangaData?.data?.length || 0) > visibleManga;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* About Section */}
      {about && (
        <SectionCard title="Biography">
          <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
            {about}
          </p>
        </SectionCard>
      )}

      {/* Works */}
      <SectionCard title="Credits">
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10 gap-1 md:gap-0 p-1 md:p-0 mb-6 bg-muted/30 md:bg-muted">
            <TabsTrigger value="voice" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Voice Acting Roles
            </TabsTrigger>
            <TabSeparator />
            <TabsTrigger value="anime" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Anime Staff Positions
            </TabsTrigger>
            <TabSeparator />
            <TabsTrigger value="manga" className="w-full py-2.5 md:py-0 text-sm justify-center cursor-pointer">
              Published Manga
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-4">
            {voicesData && voicesData.data && voicesData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {displayVoices.map((voice: PersonVoiceRole, i: number) => (
                    <div
                      key={`voice-${voice?.character?.mal_id}-${voice?.anime?.mal_id}-${i}`}
                      className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link href={`/character/${voice?.character?.mal_id}/${toSnakeCase(voice?.character?.name || "unknown")}`} className="shrink-0 relative">
                          <Image
                            src={voice?.character?.images?.webp?.image_url || "/placeholder-character.png"}
                            alt={voice?.character?.name || "Character"}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover shadow-sm h-14 w-14 sm:h-16 sm:w-16 transition-transform duration-300 group-hover:scale-105"
                            placeholder="empty"
                            loading="lazy"
                          />
                        </Link>
                        <div className="min-w-0 space-y-0.5">
                          <Link href={`/character/${voice?.character?.mal_id}/${toSnakeCase(voice?.character?.name || "unknown")}`}>
                            <p className="font-semibold text-sm text-foreground truncate hover:text-primary transition-colors">
                              {voice?.character?.name || "Unknown Character"}
                            </p>
                          </Link>
                          <p className="text-xs text-muted-foreground font-medium">{voice?.role || "Voice Actor"}</p>
                        </div>
                      </div>

                      <div className="flex md:hidden shrink-0 px-2 text-xs text-muted-foreground font-medium uppercase tracking-wider items-center justify-center py-1 bg-muted/50 rounded-md">
                        From
                      </div>

                      <div className="flex items-center gap-3 flex-1 min-w-0 md:justify-end md:text-right">
                        <Link href={`/anime/${voice?.anime?.mal_id}/${toSnakeCase(voice?.anime?.title || "unknown")}`} className="shrink-0 overflow-hidden rounded-md md:order-last">
                          <Image
                            src={voice?.anime?.images?.webp?.image_url || "/placeholder-anime.png"}
                            alt={voice?.anime?.title || "Anime"}
                            width={48}
                            height={64}
                            className="object-cover shadow-sm h-14 w-10 sm:h-16 sm:w-12 transition-transform duration-300 group-hover:scale-110"
                            placeholder="empty"
                            loading="lazy"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/anime/${voice?.anime?.mal_id}/${toSnakeCase(voice?.anime?.title || "unknown")}`}>
                            <h4 className="font-semibold text-sm text-foreground line-clamp-2 md:text-muted-foreground hover:text-primary transition-colors">
                              {voice?.anime?.title || "Unknown Anime"}
                            </h4>
                          </Link>
                        </div>
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
              <div className="text-sm text-muted-foreground text-center py-8">No voice acting roles available</div>
            )}
          </TabsContent>

          <TabsContent value="anime" className="mt-4">
            {animeData && animeData.data && animeData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {displayAnime.map((animeItem: PersonAnimeStaff, i: number) => (
                    <div key={`anime-${animeItem?.anime?.mal_id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                      <Link href={`/anime/${animeItem?.anime?.mal_id}/${toSnakeCase(animeItem?.anime?.title || "unknown")}`} className="shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={animeItem?.anime?.images?.webp?.image_url || "/placeholder-anime.png"}
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
                        <p className="text-xs text-muted-foreground font-medium">{animeItem?.position || "Staff"}</p>
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
              <div className="text-sm text-muted-foreground text-center py-8">No anime staff positions available</div>
            )}
          </TabsContent>

          <TabsContent value="manga" className="mt-4">
            {mangaData && mangaData.data && mangaData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {displayManga.map((manga: PersonMangaStaff, i: number) => (
                    <div key={`manga-${manga?.manga?.mal_id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                      <Link href={`/manga/${manga?.manga?.mal_id}/${toSnakeCase(manga?.manga?.title || "unknown")}`} className="shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={manga?.manga?.images?.webp?.image_url || "/placeholder-manga.png"}
                          alt={manga?.manga?.title || "Manga"}
                          width={48}
                          height={64}
                          className="object-cover shadow-sm h-16 w-12 transition-transform duration-300 group-hover:scale-110"
                          placeholder="empty"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <Link href={`/manga/${manga?.manga?.mal_id}/${toSnakeCase(manga?.manga?.title || "unknown")}`}>
                          <h4 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {manga?.manga?.title || "Unknown Manga"}
                          </h4>
                        </Link>
                        <p className="text-xs text-muted-foreground font-medium">{manga?.position || "Staff"}</p>
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
              <div className="text-sm text-muted-foreground text-center py-8">No published manga available</div>
            )}
          </TabsContent>
        </Tabs>
      </SectionCard>
    </div>
  );
}
