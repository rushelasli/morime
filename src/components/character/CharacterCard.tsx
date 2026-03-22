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
  view?: "grid" | "list";
}

export function CharacterCard({ character, view = "grid" }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  const characterName = character.name || "Unknown Character";
  const imageUrl = character.images?.webp?.image_url || character.images?.jpg?.image_url;

  return (
    <Link
      href={`/character/${character.mal_id}/${toSnakeCase(characterName)}`}
      className={`group block transition-all duration-300 ${
        view === "list"
          ? "p-4 border border-border rounded-lg hover:border-primary hover:shadow-md"
          : "hover:-translate-y-1"
      }`}
    >
      <div className={view === "list" ? "flex items-start space-x-4" : "w-full h-auto flex flex-col"}>
        <div 
          className={`shrink-0 overflow-hidden bg-muted relative ${
            view === "list" 
              ? "w-16 h-16 rounded-lg" 
              : "w-full aspect-2/3 rounded-lg shadow-lg group-hover:shadow-xl"
          }`}
        >
          {imageUrl && !imageError ? (
            <Image
              src={getImageWithFallback(imageUrl)}
              alt={characterName}
              fill
              className={`object-cover ${
                view === "grid" ? "transition-all duration-500 group-hover:scale-110" : ""
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className={`min-w-0 ${view === "list" ? "flex-1" : "pt-2"}`}>
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
            {characterName}
          </h3>

          {character.name_kanji && (
             <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
               {character.name_kanji}
             </p>
          )}

          <div className={`space-y-1 ${view === "list" ? "mt-2" : "mt-1 flex flex-col"}`}>
            {(character.favorites ?? 0) > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Heart className="w-3 h-3 mr-1" />
                <span>{character.favorites.toLocaleString()}{view === "list" ? " favorites" : ""}</span>
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