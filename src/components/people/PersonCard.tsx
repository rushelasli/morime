"use client";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { User, Calendar, Heart } from "lucide-react";
import { getImageWithFallback } from "@/lib/utils/ImageFallback";
import { useState } from "react";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { Person } from "@/types/people";

interface PersonCardProps {
  person: Person;
  view?: "grid" | "list";
}

export function PersonCard({ person, view = "grid" }: PersonCardProps) {
  const [imageError, setImageError] = useState(false);

  const personName = person.name || "Unknown Person";
  const imageUrl = person.images?.jpg?.image_url;

  const formatBirthday = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const birthday = formatBirthday(person.birthday);

  return (
    <Link
      href={`/people/${person.mal_id}/${toSnakeCase(personName)}`}
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
              alt={personName}
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
            {personName}
          </h3>

          <div className={`space-y-1 ${view === "list" ? "mt-2" : "mt-1 flex flex-col"}`}>
            {(person.favorites ?? 0) > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Heart className="w-3 h-3 mr-1" />
                <span>{person.favorites.toLocaleString()}{view === "list" ? " favorites" : ""}</span>
              </div>
            )}

            {birthday && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{birthday}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}