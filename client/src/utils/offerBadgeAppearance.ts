import { Gift, Package, Tag, Ticket, type LucideIcon } from "lucide-react";

type OfferBadgeAppearance = {
  Icon: LucideIcon;
  gradient: string;
};

const OFFER_BADGE_PRIORITY = [
  "direct_discount",
  "coupon",
  "free_product",
  "bundle_discount",
] as const;

export const getPrimaryOfferBadgeAppearance = (
  offers: Array<{ type?: string | null | undefined }> | null | undefined,
): OfferBadgeAppearance | null => {
  if (!Array.isArray(offers) || offers.length === 0) return null;

  const currentOffer = OFFER_BADGE_PRIORITY
    .map((type) => offers.find((offer) => offer?.type === type))
    .find(Boolean);

  switch (currentOffer?.type) {
    case "direct_discount":
      return { Icon: Tag, gradient: "from-red-500 to-pink-600" };
    case "coupon":
      return { Icon: Ticket, gradient: "from-blue-500 to-indigo-600" };
    case "free_product":
      return { Icon: Gift, gradient: "from-green-500 to-emerald-600" };
    case "bundle_discount":
      return { Icon: Package, gradient: "from-purple-500 to-violet-600" };
    default:
      return null;
  }
};
