import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heart, Cake } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface PersonImageProps {
  imageUrl?: string | null;
  name: string;
}

const PersonImage = ({ imageUrl, name }: PersonImageProps) => {
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

interface PersonPosterProps {
  imageUrl?: string | null;
  name: string;
}

const PersonPoster = ({ imageUrl, name }: PersonPosterProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="h-45 w-32.5 sm:h-52.5 sm:w-37.5 lg:h-62.5 lg:w-45 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)] shrink-0 -mt-14 sm:-mt-18 md:-mt-24 sm:mb-0 ring-2 ring-white/10 bg-card transform transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] hover:scale-[1.02]">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          width={260}
          height={360}
          priority={true}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
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

interface PersonTitleProps {
  name: string;
  givenName?: string | null;
  familyName?: string | null;
  alternateNames?: string[];
}

const PersonTitle = ({ name, givenName, familyName, alternateNames }: PersonTitleProps) => {
  const getAlternativeName = () => {
    if (givenName && familyName) {
      return `${givenName} ${familyName}`;
    }
    return alternateNames?.[0] || "\u00A0";
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
  birthday?: string | null;
  favorites?: number;
}

const InfoTags = ({ birthday, favorites }: InfoTagsProps) => {
  const formatBirthday = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-y-2 gap-x-3 mt-3 mb-4">
      {birthday && (
        <div className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1 text-xs">
          <Cake className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
          <span className="font-medium">{formatBirthday(birthday)}</span>
        </div>
      )}

      {favorites && favorites > 0 && (
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
}

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
  voiceCount?: number;
  mangaCount?: number;
}

const StatsGrid = ({ animeCount = 0, voiceCount = 0, mangaCount = 0 }: StatsGridProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
      <StatCard label="Anime Staff Positions" value={formatNumber(animeCount)} />
      <StatCard label="Voice Acting Roles" value={formatNumber(voiceCount)} />
      <StatCard label="Published Manga" value={formatNumber(mangaCount)} className="col-span-2 sm:col-span-1" />
    </div>
  );
};

interface PersonHeroSectionProps {
  heroData: {
    imageUrl?: string | null;
    name: string;
    givenName?: string | null;
    familyName?: string | null;
    alternateNames?: string[];
    birthday?: string | null;
    favorites?: number;
    animeCount?: number;
    voiceCount?: number;
    mangaCount?: number;
  };
}

export function PersonHeroSection({ heroData }: PersonHeroSectionProps) {
  const {
    imageUrl,
    name,
    givenName,
    familyName,
    alternateNames,
    birthday,
    favorites,
    animeCount,
    voiceCount,
    mangaCount,
  } = heroData;

  return (
    <section className="w-full min-h-100 md:min-h-125 lg:min-h-150 relative overflow-hidden bg-linear-to-b from-background/60 via-background/80 to-background">
      <PersonImage imageUrl={imageUrl} name={name} />

      <PageContainer noPaddingY className="h-full relative z-10">
        <div className="flex h-full items-end pb-8 md:pb-10 pt-20 sm:pt-24">
          <div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-8 items-center sm:items-start md:items-end">
            <PersonPoster imageUrl={imageUrl} name={name} />

            <div className="flex-1 mt-0 md:mt-10 text-center sm:text-left max-w-full">
              <PersonTitle
                name={name}
                givenName={givenName}
                familyName={familyName}
                alternateNames={alternateNames}
              />
              <InfoTags birthday={birthday} favorites={favorites} />
              <StatsGrid animeCount={animeCount} voiceCount={voiceCount} mangaCount={mangaCount} />

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
