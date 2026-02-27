import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useUpdateProduct } from '../hooks/useQueries';
import { type ProductListing } from '../backend';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductListing;
  index: number;
}

export default function EditProductModal({ open, onClose, product, index }: EditProductModalProps) {
  const [form, setForm] = useState<ProductListing>(product);
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (open) setForm(product);
  }, [open, product]);

  const handleChange = (field: keyof ProductListing, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amazonUrl.trim()) return;
    const updated: ProductListing = {
      ...form,
      price: form.price?.trim() || undefined,
    };
    await updateProduct.mutateAsync({ index, product: updated });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Product</DialogTitle>
          <DialogDescription>Update the details for this product listing.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-prod-title">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-prod-title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-prod-description">Description</Label>
            <Textarea
              id="edit-prod-description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-prod-price">Price (optional)</Label>
              <Input
                id="edit-prod-price"
                placeholder="$29.99"
                value={form.price ?? ''}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-prod-thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="edit-prod-thumbnailUrl"
                placeholder="https://…"
                value={form.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-prod-amazonUrl">
              Amazon URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-prod-amazonUrl"
              value={form.amazonUrl}
              onChange={(e) => handleChange('amazonUrl', e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber text-charcoal-dark hover:bg-amber-light font-semibold shadow-amber-glow"
              disabled={updateProduct.isPending || !form.title.trim() || !form.amazonUrl.trim()}
            >
              {updateProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
