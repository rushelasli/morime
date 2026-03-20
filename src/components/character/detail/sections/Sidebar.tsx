import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/components/ui/Link";

interface CharacterSidebarProps {
  sidebarData: {
    name: string;
    nameKanji?: string | null;
    nicknames?: string[];
    favorites?: number;
    url?: string;
  };
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-sm text-foreground/90 border-b border-border/50 pb-2 mb-3">{children}</h3>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4 text-sm py-1.5">
      <span className="text-muted-foreground font-medium shrink-0">{label}</span>
      <span className="text-foreground text-right break-words">{value}</span>
    </div>
  );
};

const BadgeList = ({ items }: { items?: string[] }) => {
  if (!items || items.length === 0) return <span className="text-muted-foreground text-right">None</span>;
  return (
    <div className="flex flex-wrap gap-1.5 justify-end">
      {items.map((item, i) => (
        <Badge key={i} variant="secondary" className="font-normal text-xs px-2 py-0">
          {item}
        </Badge>
      ))}
    </div>
  );
};

export function CharacterSidebar({ sidebarData }: CharacterSidebarProps) {
  const { nameKanji, nicknames, favorites, url } = sidebarData;

  const hasAlternativeNames = nameKanji || (nicknames && nicknames.length > 0);

  return (
    <div className="space-y-6">
      <div className="py-0 shadow-lg border border-border/40 rounded-xl bg-card overflow-hidden">
        <div className="p-4 space-y-6 divide-y divide-border/40">
          {/* Alternative Names Section */}
          {hasAlternativeNames && (
            <div className="pt-0">
              <SectionTitle>Alternative Names</SectionTitle>
              <div className="space-y-1">
                <InfoRow label="Japanese" value={nameKanji} />
                <div className="flex justify-between items-start gap-4 text-sm py-1.5">
                  <span className="text-muted-foreground font-medium shrink-0">Nicknames</span>
                  <BadgeList items={nicknames} />
                </div>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          <div className={hasAlternativeNames ? "pt-4" : "pt-0"}>
            <SectionTitle>Statistics</SectionTitle>
            <div className="space-y-1">
              <InfoRow label="Favorites" value={favorites ? favorites.toLocaleString() : "0"} />
            </div>
          </div>

          {/* Links Section */}
          <div className="pt-4">
            <SectionTitle>External Links</SectionTitle>
            <div className="space-y-2">
              {url && (
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors text-sm group"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">MyAnimeList</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}