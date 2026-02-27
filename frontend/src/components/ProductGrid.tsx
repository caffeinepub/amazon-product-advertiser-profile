import React, { useState } from 'react';
import { Plus, PackageOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { type ProductListing } from '../backend';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

interface ProductGridProps {
  products: ProductListing[];
  isLoading: boolean;
  isOwner: boolean;
}

export default function ProductGrid({ products, isLoading, isOwner }: ProductGridProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="container mx-auto px-4 md:px-6 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            My Picks
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Hand-picked Amazon products I love and recommend
          </p>
        </div>
        {isOwner && (
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-amber text-charcoal-dark hover:bg-amber-light font-semibold gap-2 shadow-amber-glow"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border bg-card">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 mb-4">
            <PackageOpen className="h-8 w-8 text-amber" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {isOwner
              ? 'Start adding your favorite Amazon products to showcase them here.'
              : 'This profile has no product recommendations yet.'}
          </p>
          {isOwner && (
            <Button
              onClick={() => setAddOpen(true)}
              className="mt-6 bg-amber text-charcoal-dark hover:bg-amber-light font-semibold gap-2 shadow-amber-glow"
            >
              <Plus className="h-4 w-4" />
              Add Your First Product
            </Button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} index={i} isOwner={isOwner} />
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} />
    </section>
  );
}
