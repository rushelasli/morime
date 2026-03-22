import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/components/ui/Link";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { ReactNode } from "react";
import type { Published, Genre, ThemeCategory, Demographic } from "@/types/anime";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  condition?: boolean | string | number | null | unknown[];
}

const SidebarSection = ({ title, children, condition = true }: SidebarSectionProps) => {
  if (!condition) return null;

  return (
    <div className="py-3">
      <span className="text-sm font-semibold text-foreground/90">{title}</span>
      <div className="mt-1.5 space-y-2">{children}</div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  children: ReactNode;
}

const InfoRow = ({ label, children }: InfoRowProps) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    {children}
  </div>
);

interface BadgeListProps<T> {
  items?: T[] | null;
  renderBadge: (item: T) => ReactNode;
  className?: string;
}

const BadgeList = <T,>({ items, renderBadge, className = "flex flex-wrap gap-1.5 justify-end" }: BadgeListProps<T>) => (
  <div className={className}>{items?.map(renderBadge)}</div>
);

const InfoValue = ({ children }: { children: ReactNode }) => <span className="font-medium text-right">{children}</span>;

interface AlternativeTitlesSectionProps {
  titleJapanese?: string | null;
  titleSynonyms?: string[] | null;
}

const AlternativeTitlesSection = ({ titleJapanese, titleSynonyms }: AlternativeTitlesSectionProps) => {
  const hasAlternativeTitles = titleJapanese || (titleSynonyms && titleSynonyms.length > 0);

  return (
    <SidebarSection title="Alternative Titles" condition={hasAlternativeTitles}>
      {titleJapanese && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground/80 font-medium block">Japanese</span>
          <div className="font-japanese text-sm">{titleJapanese}</div>
        </div>
      )}

      {titleSynonyms && titleSynonyms.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground/80 font-medium block">Synonyms</span>
          <div className="space-y-0.5">
            {titleSynonyms.map((title, i) => (
              <div key={i} className="text-sm">
                {title}
              </div>
            ))}
          </div>
        </div>
      )}
    </SidebarSection>
  );
};

interface BasicInfoSectionProps {
  status?: string | null;
  chapters?: number | null;
  volumes?: number | null;
  published?: Published | null;
  type?: string | null;
}

const BasicInfoSection = ({ status, chapters, volumes, published, type }: BasicInfoSectionProps) => {
  const formatPublished = (pub: Published | null | undefined) => {
    if (!pub) return "N/A";

    const from = pub.from ? new Date(pub.from).toLocaleDateString() : null;
    const to = pub.to ? new Date(pub.to).toLocaleDateString() : null;

    if (from && to) {
      return `${from} to ${to}`;
    } else if (from) {
      return `${from} to ?`;
    }
    return "N/A";
  };

  return (
    <SidebarSection title="Basic Info">
      <InfoRow label="Type">
        <InfoValue>{type || "N/A"}</InfoValue>
      </InfoRow>

      <InfoRow label="Status">
        <InfoValue>{status?.replace(/_/g, " ") || "N/A"}</InfoValue>
      </InfoRow>

      <InfoRow label="Volumes">
        <InfoValue>{volumes || "?"}</InfoValue>
      </InfoRow>

      <InfoRow label="Chapters">
        <InfoValue>{chapters || "?"}</InfoValue>
      </InfoRow>

      <InfoRow label="Published">
        <InfoValue>{formatPublished(published)}</InfoValue>
      </InfoRow>
    </SidebarSection>
  );
};

interface AuthorSerialization {
  mal_id: number;
  name: string;
  type: string;
  url: string;
}

interface CreditsSectionProps {
  authors?: AuthorSerialization[] | null;
  serializations?: AuthorSerialization[] | null;
}

const CreditsSection = ({ authors, serializations }: CreditsSectionProps) => (
  <SidebarSection title="Credits">
    {authors && authors.length > 0 && (
      <InfoRow label="Authors">
        <BadgeList
          items={authors}
          renderBadge={author => (
            <Link key={author.mal_id} href={`/people/${author.mal_id}/${toSnakeCase(author.name)}`}>
              <Badge variant="outline" className="text-xs hover:bg-primary/10 py-0 h-5 sm:h-6">
                {author.name}
              </Badge>
            </Link>
          )}
        />
      </InfoRow>
    )}

    {serializations && serializations.length > 0 && (
      <InfoRow label="Serialization">
        <BadgeList
          items={serializations}
          renderBadge={serialization => (
            <Badge key={serialization.mal_id} variant="outline" className="text-xs hover:bg-primary/10 py-0 h-5 sm:h-6">
              {serialization.name}
            </Badge>
          )}
        />
      </InfoRow>
    )}
  </SidebarSection>
);

interface DetailsSectionProps {
  genres?: Genre[] | null;
  themes?: ThemeCategory[] | null;
  demographics?: Demographic[] | null;
}

const DetailsSection = ({ genres, themes, demographics }: DetailsSectionProps) => (
  <SidebarSection title="Details">
    {genres && genres.length > 0 && (
      <InfoRow label="Genres">
        <BadgeList
          items={genres}
          renderBadge={genre => (
            <Link key={genre.mal_id} href={`/manga/genre/${genre.mal_id}/${toSnakeCase(genre.name)}`}>
              <Badge variant="outline" className="text-xs hover:bg-primary/10 py-0 h-5 sm:h-6">
                {genre.name}
              </Badge>
            </Link>
          )}
        />
      </InfoRow>
    )}

    {themes && themes.length > 0 && (
      <InfoRow label="Themes">
        <BadgeList
          items={themes}
          renderBadge={theme => (
            <Link key={theme.mal_id} href={`/manga/theme/${theme.mal_id}/${toSnakeCase(theme.name)}`}>
              <Badge variant="outline" className="text-xs hover:bg-primary/10 py-0 h-5 sm:h-6">
                {theme.name}
              </Badge>
            </Link>
          )}
        />
      </InfoRow>
    )}

    {demographics && demographics.length > 0 && (
      <InfoRow label="Demographics">
        <BadgeList
          items={demographics}
          renderBadge={demographic => (
            <Badge key={demographic.mal_id} variant="outline" className="text-xs py-0 h-5 sm:h-6">
              {demographic.name}
            </Badge>
          )}
        />
      </InfoRow>
    )}
  </SidebarSection>
);

interface StatisticsSectionProps {
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  favorites?: number | null;
}

const StatisticsSection = ({ rank, popularity, members, favorites }: StatisticsSectionProps) => {
  const formatNumber = (num: number | null | undefined) => {
    return num ? num.toLocaleString() : "N/A";
  };

  const formatRank = (r: number | null | undefined) => {
    return r ? `#${r}` : "N/A";
  };

  return (
    <SidebarSection title="Statistics">
      <InfoRow label="Rank">
        <InfoValue>{formatRank(rank)}</InfoValue>
      </InfoRow>

      <InfoRow label="Popularity">
        <InfoValue>{formatRank(popularity)}</InfoValue>
      </InfoRow>

      <InfoRow label="Members">
        <InfoValue>{formatNumber(members)}</InfoValue>
      </InfoRow>

      <InfoRow label="Favorites">
        <InfoValue>{formatNumber(favorites)}</InfoValue>
      </InfoRow>
    </SidebarSection>
  );
};

export interface MangaSidebarProps {
  sidebarData: {
    titleJapanese?: string | null;
    titleSynonyms?: string[] | null;
    status?: string | null;
    chapters?: number | null;
    volumes?: number | null;
    published?: Published | null;
    type?: string | null;
    authors?: AuthorSerialization[] | null;
    serializations?: AuthorSerialization[] | null;
    genres?: Genre[] | null;
    themes?: ThemeCategory[] | null;
    demographics?: Demographic[] | null;
    rank?: number | null;
    popularity?: number | null;
    members?: number | null;
    favorites?: number | null;
  };
}

export function MangaSidebar({ sidebarData }: MangaSidebarProps) {
  const {
    titleJapanese,
    titleSynonyms,
    status,
    chapters,
    volumes,
    published,
    type,
    authors,
    serializations,
    genres,
    themes,
    demographics,
    rank,
    popularity,
    members,
    favorites,
  } = sidebarData;

  return (
    <Card className="py-0 shadow-lg border-border/40">
      <CardContent className="p-4 space-y-0 divide-y divide-border/60">
        <AlternativeTitlesSection titleJapanese={titleJapanese} titleSynonyms={titleSynonyms} />
        <BasicInfoSection status={status} chapters={chapters} volumes={volumes} published={published} type={type} />
        <CreditsSection authors={authors} serializations={serializations} />
        <DetailsSection genres={genres} themes={themes} demographics={demographics} />
        <StatisticsSection rank={rank} popularity={popularity} members={members} favorites={favorites} />
      </CardContent>
    </Card>
  );
}