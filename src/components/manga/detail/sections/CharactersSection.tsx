"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon } from "lucide-react";
import { EmptyState } from "@/components/content/EmptyState";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { Character } from "@/types/anime";

interface MangaCharactersSectionProps {
  characters?: Character[] | null;
}

export function MangaCharactersSection({ characters }: MangaCharactersSectionProps) {
  const initialLimit = 16;
  const [visibleCharacters, setVisibleCharacters] = useState(initialLimit);
  const INCREMENT = 6;

  if (!characters || characters.length === 0) {
    return <EmptyState message="No characters information available." />;
  }

  const displayCharacters = characters.slice(0, visibleCharacters);
  const hasMoreCharacters = visibleCharacters < characters.length;

  const loadMore = () => {
    setVisibleCharacters(prev => Math.min(prev + INCREMENT, characters.length));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayCharacters.map((character, i) => {
          return (
            <div
              key={`${character.character?.mal_id}-${i}`}
              className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-border transition-all duration-200 hover:shadow-sm"
            >
              <Link
                href={`/character/${character.character?.mal_id}/${toSnakeCase(character.character?.name || "unknown")}`}
                className="shrink-0 block"
              >
                <Image
                  src={character.character?.images?.webp?.image_url || "/placeholder-character.png"}
                  alt={character.character?.name || "Character"}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover shadow-sm transition-transform hover:scale-105"
                  placeholder="empty"
                  loading="lazy"
                  quality={70}
                  sizes="64px"
                />
              </Link>

              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/character/${character.character?.mal_id}/${toSnakeCase(character.character?.name || "unknown")}`}
                  className="font-semibold text-sm text-foreground truncate hover:text-primary transition-colors block"
                >
                  {character.character?.name || "Unknown Character"}
                </Link>
                <p className="text-xs text-muted-foreground font-medium">{character.role || "Unknown Role"}</p>
              </div>
            </div>
          );
        })}
      </div>

      {characters.length > initialLimit && (
        <div className="mt-4 space-y-2">
          {hasMoreCharacters && (
            <Button variant="outline" className="w-full" onClick={loadMore}>
              <ChevronDownIcon className="h-4 w-4 mr-2" />
              Show More
            </Button>
          )}
        </div>
      )}
    </>
  );
}
