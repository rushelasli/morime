"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Link } from "@/components/ui/Link";
import Image from "next/image";
import { globalSearch } from "@/actions/SearchActions";
import { useDebounce } from "@/hooks/useDebounce";
import { toSnakeCase } from "@/lib/utils/Formatter";

interface GlobalSearchProps {
  autoFocus?: boolean;
  onSearch?: () => void;
}

export function GlobalSearch({ autoFocus = false, onSearch }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ anime: any[]; manga: any[]; characters: any[] } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (activeIndex >= 0) {
      const el = document.getElementById(`search-item-${activeIndex}`);
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (debouncedQuery.length < 3) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await globalSearch(debouncedQuery);
        if (isMounted && data) {
          setResults(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/anime?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onSearch) onSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
    if (e.target.value.length >= 3) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onSearch) onSearch();
  };

  const hasResults = results && (results.anime.length > 0 || results.manga.length > 0 || results.characters.length > 0);

  const totalItems = hasResults ? results!.anime.length + results!.manga.length + results!.characters.length + 1 : 1;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        const el = document.getElementById(`search-item-${activeIndex}`);
        if (el) {
          el.click();
        }
      }
    }
  };

  let currentIndex = 0;

  return (
    <div ref={containerRef} className="relative flex-1 w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          placeholder="Search something..."
          className="pl-10 w-full bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary transition-all"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 3) setIsOpen(true);
          }}
        />
      </form>

      {isOpen && query.length >= 3 && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[80vh] md:max-h-[70vh]"
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>View all results for "{query}"</span>
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {!hasResults ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
                ) : (
                  <>
                    {results.anime.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                          Anime
                        </h4>
                        <div className="space-y-1">
                          {results.anime.map(item => {
                            const title = item.titles?.[0]?.title || item.title || "Unknown";
                            const itemIndex = currentIndex++;
                            return (
                              <Link
                                id={`search-item-${itemIndex}`}
                                role="option"
                                aria-selected={activeIndex === itemIndex}
                                key={`anime-${item.mal_id}`}
                                href={`/anime/${item.mal_id}/${toSnakeCase(title)}`}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${activeIndex === itemIndex ? "bg-accent" : "hover:bg-accent"}`}
                              >
                                <div className="shrink-0 w-10 h-14 bg-muted overflow-hidden rounded relative">
                                  <Image
                                    src={
                                      item.images?.webp?.small_image_url ||
                                      item.images?.jpg?.small_image_url ||
                                      "/placeholder-anime.png"
                                    }
                                    alt={title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium line-clamp-1">{title}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.type || "Anime"} • {item.year || "N/A"}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {results.manga.length > 0 && (
                      <div>
                        {results.anime.length > 0 && <Separator className="my-2" />}
                        <h4 className="text-[10px] font-bold text-muted-foreground px-2 mb-2 mt-2 uppercase tracking-wider">
                          Manga
                        </h4>
                        <div className="space-y-1">
                          {results.manga.map(item => {
                            const title = item.titles?.[0]?.title || item.title || "Unknown";
                            const itemIndex = currentIndex++;
                            return (
                              <Link
                                id={`search-item-${itemIndex}`}
                                role="option"
                                aria-selected={activeIndex === itemIndex}
                                key={`manga-${item.mal_id}`}
                                href={`/manga/${item.mal_id}/${toSnakeCase(title)}`}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${activeIndex === itemIndex ? "bg-accent" : "hover:bg-accent"}`}
                              >
                                <div className="shrink-0 w-10 h-14 bg-muted overflow-hidden rounded relative">
                                  <Image
                                    src={
                                      item.images?.webp?.small_image_url ||
                                      item.images?.jpg?.small_image_url ||
                                      "/placeholder-manga.png"
                                    }
                                    alt={title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium line-clamp-1">{title}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.type || "Manga"} • {item.chapters ? `${item.chapters} ch` : "Ongoing"}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {results.characters.length > 0 && (
                      <div>
                        {(results.anime.length > 0 || results.manga.length > 0) && <Separator className="my-2" />}
                        <h4 className="text-[10px] font-bold text-muted-foreground px-2 mb-2 mt-2 uppercase tracking-wider">
                          Characters
                        </h4>
                        <div className="space-y-1">
                          {results.characters.map(item => {
                            const itemIndex = currentIndex++;
                            return (
                              <Link
                                id={`search-item-${itemIndex}`}
                                role="option"
                                aria-selected={activeIndex === itemIndex}
                                key={`char-${item.mal_id}`}
                                href={`/character/${item.mal_id}/${toSnakeCase(item.name)}`}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${activeIndex === itemIndex ? "bg-accent" : "hover:bg-accent"}`}
                              >
                                <div className="shrink-0 w-10 h-14 bg-muted overflow-hidden rounded relative">
                                  <Image
                                    src={
                                      item.images?.webp?.image_url ||
                                      item.images?.jpg?.image_url ||
                                      "/placeholder-character.png"
                                    }
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.name_kanji || "Character"}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-muted/30 p-2 border-t border-border shrink-0">
                <Link
                  id={`search-item-${currentIndex}`}
                  role="option"
                  aria-selected={activeIndex === currentIndex}
                  href={`/anime?q=${encodeURIComponent(query)}`}
                  onClick={handleLinkClick}
                  className={`block w-full py-2 text-left px-2 text-sm text-primary font-medium transition-colors ${activeIndex === currentIndex ? "text-primary/80 bg-accent rounded-md" : "hover:text-primary/80"}`}
                >
                  View all results for "{query}"
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
