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
}

export function PersonCard({ person }: PersonCardProps) {
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
      className="group block p-4 border border-border rounded-lg hover:border-primary transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-start space-x-4">
        <div className="shrink-0 w-16 h-16 overflow-hidden rounded-lg bg-muted relative">
          {imageUrl && !imageError ? (
            <Image
              src={getImageWithFallback(imageUrl)}
              alt={personName}
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
            {personName}
          </h3>

          <div className="mt-2 space-y-1">
            {(person.favorites ?? 0) > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Heart className="w-3 h-3 mr-1" />
                <span>{person.favorites.toLocaleString()} favorites</span>
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