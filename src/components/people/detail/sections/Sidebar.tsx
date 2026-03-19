import { Link } from "@/components/ui/Link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toSnakeCase } from "@/lib/utils/Formatter";

const SidebarSection = ({ title, children, condition = true }) => {
  if (!condition) return null;

  return (
    <div className="py-3">
      <span className="text-sm font-semibold text-foreground/90">{title}</span>
      <div className="mt-1.5 space-y-2">{children}</div>
    </div>
  );
};

const InfoRow = ({ label, children }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    {children}
  </div>
);

const BadgeList = ({ items, renderBadge, className = "flex flex-wrap gap-1.5 justify-end" }) => (
  <div className={className}>{items?.map(renderBadge)}</div>
);

const InfoValue = ({ children }) => <span className="font-medium text-right">{children}</span>;

const AlternativeNamesSection = ({ givenName, familyName, alternateNames }) => {
  const hasAlternativeNames = givenName || familyName || (alternateNames && alternateNames.length > 0);

  return (
    <SidebarSection title="Alternative Names" condition={hasAlternativeNames}>
      {givenName && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground/80 font-medium block">Given Name</span>
          <div className="text-sm">{givenName}</div>
        </div>
      )}

      {familyName && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground/80 font-medium block">Family Name</span>
          <div className="text-sm">{familyName}</div>
        </div>
      )}

      {alternateNames?.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground/80 font-medium block">Other Names</span>
          <div className="space-y-0.5">
            {alternateNames.map((name, i) => (
              <div key={`name-${i}-${name}`} className="text-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </SidebarSection>
  );
};

const BasicInfoSection = ({ birthday, website_url }) => {
  const formatBirthday = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const calculateAge = (date: string) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const age = birthday ? calculateAge(birthday) : null;

  return (
    <SidebarSection title="Basic Info" condition={birthday || website_url}>
      {birthday && (
        <>
          <InfoRow label="Birthday">
            <InfoValue>{formatBirthday(birthday)}</InfoValue>
          </InfoRow>
          {age && (
            <InfoRow label="Age">
              <InfoValue>{age}</InfoValue>
            </InfoRow>
          )}
        </>
      )}

      {website_url && (
        <InfoRow label="Website">
          <Link href={website_url} target="_blank" className="text-xs text-primary hover:underline">
            Visit
          </Link>
        </InfoRow>
      )}
    </SidebarSection>
  );
};

const StatisticsSection = ({ favorites }) => {
  const formatNumber = num => {
    return num ? num.toLocaleString() : "N/A";
  };

  return (
    <SidebarSection title="Statistics">
      <InfoRow label="Favorites">
        <InfoValue>{formatNumber(favorites)}</InfoValue>
      </InfoRow>
    </SidebarSection>
  );
};

export function PersonSidebar({ sidebarData }) {
  const {
    givenName,
    familyName,
    alternateNames,
    birthday,
    website_url,
    favorites,
    url,
  } = sidebarData;

  return (
    <Card className="py-0 shadow-lg border-border/40">
      <CardContent className="p-4 space-y-0 divide-y divide-border/60">
        <AlternativeNamesSection givenName={givenName} familyName={familyName} alternateNames={alternateNames} />
        <BasicInfoSection birthday={birthday} website_url={website_url} />
        <SidebarSection title="Links">
          {url && (
            <Link href={url} target="_blank" className="text-xs text-primary hover:underline block">
              View on MAL →
            </Link>
          )}
        </SidebarSection>
        <StatisticsSection favorites={favorites} />
      </CardContent>
    </Card>
  );
}