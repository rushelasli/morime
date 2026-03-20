import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heart, User } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface CharacterImageProps {
  imageUrl?: string | null;
  name: string;
}

const CharacterImage = ({ imageUrl, name }: CharacterImageProps) => {
  if (!imageUrl) return null;

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-110 hover:scale-125 transition-transform duration-[10s] ease-linear">
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority={true}
            className="object-cover opacity-25 blur-[10px]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/20" />
      <div className="absolute inset-0 bg-linear-to-r from-background/90 to-transparent" />
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/noise.png')] bg-repeat" />
    </>
  );
};

interface CharacterPosterProps {
  imageUrl?: string | null;
  name: string;
}

const CharacterPoster = ({ imageUrl, name }: CharacterPosterProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="h-45 w-32.5 sm:h-52.5 sm:w-37.5 lg:h-62.5 lg:w-45 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)] shrink-0 -mt-14 sm:-mt-18 md:-mt-24 sm:mb-0 ring-2 ring-white/10 bg-card transform transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:scale-[1.02]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={260}
          height={360}
          priority={true}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <User className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
    </div>

    <div className="hidden sm:block w-full">
      <Button variant="outline" size="sm" className="w-full text-xs">
        <Heart className="h-3.5 w-3.5 mr-1.5" />
        Add To Favorites
      </Button>
    </div>
  </div>
);

interface CharacterTitleProps {
  name: string;
  nameKanji?: string | null;
  nicknames?: string[];
}

const CharacterTitle = ({ name, nameKanji, nicknames }: CharacterTitleProps) => {
  const getAlternativeName = () => {
    if (nameKanji) return nameKanji;
    return nicknames?.[0] || "\u00A0";
  };

  return (
    <>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight line-clamp-2 mb-1 sm:mb-2 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/90">
        {name}
      </h1>

      <p className="text-xs sm:text-sm md:text-base text-muted-foreground/90 line-clamp-1 mb-2 min-h-4 sm:min-h-5 md:min-h-6">
        {getAlternativeName()}
      </p>
    </>
  );
};

interface InfoTagsProps {
  favorites?: number;
}

const InfoTags = ({ favorites }: InfoTagsProps) => {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-y-2 gap-x-3 mt-3 mb-4">
      {favorites !== undefined && favorites > 0 && (
        <div className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs">
          <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />
          <span className="font-medium">{favorites.toLocaleString()} favorites</span>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ label, value, icon, className = "" }: StatCardProps) => (
  <div className={`bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border/20 flex flex-col items-center justify-center ${className}`}>
    <div className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-1 text-center">{label}</div>
    <div className="font-bold text-lg sm:text-xl flex items-center gap-1">
      {value}
      {icon}
    </div>
  </div>
);

interface StatsGridProps {
  animeCount?: number;
  mangaCount?: number;
  voiceActorCount?: number;
}

const StatsGrid = ({ animeCount = 0, mangaCount = 0, voiceActorCount = 0 }: StatsGridProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      <StatCard label="Anime Roles" value={formatNumber(animeCount)} />
      <StatCard label="Manga Roles" value={formatNumber(mangaCount)} />
      <StatCard label="Voice Actors" value={formatNumber(voiceActorCount)} className="col-span-2 sm:col-span-1" />
    </div>
  );
};

interface CharacterHeroSectionProps {
  heroData: {
    imageUrl?: string | null;
    name: string;
    nameKanji?: string | null;
    nicknames?: string[];
    favorites?: number;
    animeCount?: number;
    mangaCount?: number;
    voiceActorCount?: number;
  };
}

export function CharacterHeroSection({ heroData }: CharacterHeroSectionProps) {
  const {
    imageUrl,
    name,
    nameKanji,
    nicknames,
    favorites,
    animeCount,
    mangaCount,
    voiceActorCount,
  } = heroData;

  return (
    <section className="w-full min-h-100 md:min-h-125 lg:min-h-150 relative overflow-hidden bg-linear-to-b from-background/60 via-background/80 to-background">
      <CharacterImage imageUrl={imageUrl} name={name} />

      <PageContainer noPaddingY className="h-full relative z-10">
        <div className="flex h-full items-end pb-8 md:pb-10 pt-20 sm:pt-24">
          <div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-8 items-center sm:items-start md:items-end">
            <CharacterPoster imageUrl={imageUrl} name={name} />

            <div className="flex-1 text-center sm:text-left max-w-full">
              <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-2 sm:mb-3">
                <Badge variant="secondary" className="text-xs sm:text-sm px-2.5 py-0.5">
                  Character
                </Badge>
              </div>

              <CharacterTitle
                name={name}
                nameKanji={nameKanji}
                nicknames={nicknames}
              />
              <InfoTags favorites={favorites} />
              <StatsGrid animeCount={animeCount} mangaCount={mangaCount} voiceActorCount={voiceActorCount} />

              <div className="mt-4 flex sm:hidden">
                <Button className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Add To Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}