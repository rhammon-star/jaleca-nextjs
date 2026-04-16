'use client'

import Link from "next/link";
import Image from "next/image";
import { Heart, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { isBestSeller } from "@/lib/best-sellers";

type VariationAttr = { name: string; value: string }
type Variation = { id: string; name: string; stockStatus: string; price?: string; regularPrice?: string; salePrice?: string; image?: { sourceUrl: string; altText: string }; attributes: { nodes: VariationAttr[] } }

export type WooProduct = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  image?: { sourceUrl: string; altText: string };
  galleryImages?: { nodes: Array<{ sourceUrl: string; altText: string }> };
  variations?: { nodes: Variation[] };
  attributes?: { nodes: Array<{ name: string; options: string[] }> };
  productCategories?: { nodes: Array<{ name: string; slug: string }> };
}

function getColorVariationImage(variations: Variation[], color: string | null) {
  if (!color || variations.length === 0) return null;
  const match = variations.find(v => {
    const attr = v.attributes.nodes.find(a =>
      a.name.toLowerCase().includes("cor") || a.name.toLowerCase().includes("color")
    );
    if (!attr) return false;
    const val = attr.value.toLowerCase();
    if (color === "Branco") return val.includes("branco");
    if (color === "Preto") return val.includes("preto");
    if (color === "Colorido") return !val.includes("branco") && !val.includes("preto");
    return false;
  });
  return match?.image ?? null;
}

const ProductCard = ({ product, colorFilter }: { product: WooProduct; colorFilter?: string | null }) => {
  const variations = product.variations?.nodes ?? [];

  // A variation is on sale only if it has both salePrice and regularPrice and they differ
  const saleVariations = variations.filter(v =>
    v.salePrice && v.regularPrice && v.salePrice !== v.regularPrice
  );
  // Product is "on sale" only if ALL its variations are on sale (or it's a simple product with salePrice)
  const isOnSale = variations.length > 0
    ? saleVariations.length === variations.length
    : !!product.salePrice && product.salePrice !== product.regularPrice;

  // Some (but not all) variants are on sale
  const hasPartialSale = variations.length > 0 && saleVariations.length > 0 && saleVariations.length < variations.length;

  const displayName = product.name.replace(/ - Jaleca$/i, "");
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(product.id);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(String(product.databaseId));
  const hoverImage = product.galleryImages?.nodes?.[0];

  // When a color filter is active, prefer the matching variation's image
  const colorVariationImage = getColorVariationImage(variations, colorFilter ?? null);
  const mainImage = colorVariationImage ?? product.image;

  // Calculate discount % (only when all variants are on sale)
  const discount = isOnSale && product.regularPrice && product.salePrice
    ? Math.round((1 - parseFloat(product.salePrice.replace(/[^0-9,]/g,'').replace(',','.')) / parseFloat(product.regularPrice.replace(/[^0-9,]/g,'').replace(',','.'))) * 100)
    : null;

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#f5f3f0] aspect-[3/4] mb-3">
        {/* Main image — uses color variation image when filter is active */}
        {mainImage?.sourceUrl ? (
          <Image
            src={mainImage.sourceUrl}
            alt={mainImage.altText || product.name}
            fill
            width={400}
            height={533}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-secondary/20">Sem imagem</div>
        )}

        {/* Second image on hover — only if it's a different angle (same product alt text prefix) */}
        {hoverImage && hoverImage.sourceUrl !== product.image?.sourceUrl && (
          <Image
            src={hoverImage.sourceUrl}
            alt={hoverImage.altText || product.name}
            fill
            width={400}
            height={533}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Best-seller badge */}
        {isBestSeller(product.slug) && (
          <span className="absolute top-3 left-3 bg-[#c4a97d] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10 flex items-center gap-1">
            🏆 MAIS VENDIDO
          </span>
        )}

        {/* Discount badge */}
        {!isBestSeller(product.slug) && discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
            -{discount}%
          </span>
        )}
        {!isBestSeller(product.slug) && !discount && isOnSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
            SALE
          </span>
        )}
        {!isBestSeller(product.slug) && hasPartialSale && (
          <span className="absolute top-3 left-3 bg-[#c4a97d] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10">
            PROMO
          </span>
        )}

        {/* Quick action buttons - top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
            aria-label={inWishlist ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(String(product.databaseId))
            }}
          >
            <Heart
              size={14}
              className={inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}
            />
          </button>
          <button
            className={`w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 ${inCompare ? 'text-primary' : 'text-foreground'}`}
            aria-label={inCompare ? 'Remover da comparação' : 'Comparar'}
            onClick={(e) => {
              e.preventDefault()
              if (inCompare) removeFromCompare(product.id)
              else addToCompare(product)
            }}
          >
            <GitCompareArrows size={12} />
          </button>
        </div>

      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mb-0.5">Jaleca</p>
        <h3 className="font-body text-sm font-medium text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {displayName}
        </h3>
        <div className="flex flex-col gap-0.5">
          {isOnSale && product.regularPrice ? (
            <>
              <span className="text-[10px] text-muted-foreground">
                De <span className="line-through">{product.regularPrice}</span>
              </span>
              <span className="text-sm font-semibold text-foreground">
                Por {product.salePrice}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {product.price || product.regularPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
