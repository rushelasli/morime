"use client";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { Building2, Calendar, Heart, TrendingUp } from "lucide-react";
import { getImageWithFallback } from "@/lib/utils/ImageFallback";
import { useState } from "react";
import { toSnakeCase, formatEstablished } from "@/lib/utils/Formatter";
import type { ProducerData } from "@/types/anime";

interface ProducerCardProps {
  producers: ProducerData;
  view?: "grid" | "list";
}

export function ProducerCard({ producers, view = "grid" }: ProducerCardProps) {
  const [imageError, setImageError] = useState(false);

  const producerName = producers.titles?.[0]?.title || producers.name || "Unknown Producer";
  const imageUrl = producers.images?.jpg?.image_url;

  return (
    <Link
      href={`/producer/${producers.mal_id}/${toSnakeCase(producerName)}`}
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
              : "w-full aspect-square rounded-lg shadow-lg group-hover:shadow-xl"
          }`}
        >
          {imageUrl && !imageError ? (
            <Image
              src={getImageWithFallback(imageUrl)}
              alt={producerName}
              fill
              className={`object-cover ${
                view === "grid" ? "transition-all duration-500 group-hover:scale-110" : ""
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className={`min-w-0 ${view === "list" ? "flex-1" : "pt-2"}`}>
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">{producerName}</h3>

          <div className={`space-y-1 ${view === "list" ? "mt-2" : "mt-1 flex flex-col"}`}>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{producers.count || 0} anime</span>
            </div>

            {producers.favorites > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Heart className="w-3 h-3 mr-1" />
                <span>{producers.favorites.toLocaleString()}{view === "list" ? " favorites" : ""}</span>
              </div>
            )}

            {producers.established && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatEstablished(producers.established)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
