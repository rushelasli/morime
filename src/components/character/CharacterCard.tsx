"use client";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { User, Heart } from "lucide-react";
import { getImageWithFallback } from "@/lib/utils/ImageFallback";
import { useState } from "react";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { CharacterData } from "@/types/character";

interface CharacterCardProps {
  character: CharacterData;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  const characterName = character.name || "Unknown Character";
  const imageUrl = character.images?.webp?.image_url || character.images?.jpg?.image_url;

  return (
    <Link
      href={`/character/${character.mal_id}/${toSnakeCase(characterName)}`}
      className="group block p-4 border border-border rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start space-x-4">
        <div className="shrink-0 w-16 h-16 overflow-hidden rounded-lg bg-muted relative">
          {imageUrl && !imageError ? (
            <Image
              src={getImageWithFallback(imageUrl)}
              alt={characterName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
            {characterName}
          </h3>

          {character.name_kanji && (
             <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
               {character.name_kanji}
             </p>
          )}

          <div className="mt-2 space-y-1">
            {(character.favorites ?? 0) > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Heart className="w-3 h-3 mr-1" />
                <span>{character.favorites.toLocaleString()} favorites</span>
              </div>
            )}
            
            {character.nicknames && character.nicknames.length > 0 && (
              <div className="text-xs text-muted-foreground line-clamp-1 italic">
                "{character.nicknames[0]}"
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}