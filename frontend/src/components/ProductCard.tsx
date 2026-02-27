import React, { useState } from 'react';
import { ExternalLink, Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type ProductListing } from '../backend';
import EditProductModal from './EditProductModal';
import { useRemoveProduct } from '../hooks/useQueries';

interface ProductCardProps {
  product: ProductListing;
  index: number;
  isOwner: boolean;
}

export default function ProductCard({ product, index, isOwner }: ProductCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const removeProduct = useRemoveProduct();

  const thumbnailSrc =
    product.thumbnailUrl && !imgError
      ? product.thumbnailUrl
      : '/assets/generated/product-placeholder.dim_400x400.png';

  const handleDelete = async () => {
    await removeProduct.mutateAsync(index);
    setDeleteOpen(false);
  };

  return (
    <>
      <article className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-product product-card-hover animate-fade-in">
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={thumbnailSrc}
            alt={product.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Price badge */}
          {product.price && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber text-charcoal-dark font-bold text-sm px-2.5 py-0.5 shadow-amber-glow border-0">
                <Tag className="h-3 w-3 mr-1" />
                {product.price}
              </Badge>
            </div>
          )}
          {/* Owner actions overlay */}
          {isOwner && (
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white text-charcoal-dark shadow-sm"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-destructive hover:text-destructive-foreground text-charcoal-dark shadow-sm"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-card-foreground">
              {product.title}
            </h3>
            {product.description && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* CTA */}
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-amber text-charcoal-dark hover:bg-amber-light font-semibold gap-2 shadow-amber-glow transition-all duration-200">
              <ExternalLink className="h-4 w-4" />
              View on Amazon
            </Button>
          </a>
        </div>
      </article>

      {/* Edit Modal */}
      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        index={index}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{product.title}</strong> from your showcase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeProduct.isPending ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
