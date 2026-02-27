import React, { useState } from 'react';
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
import { Loader2, Package } from 'lucide-react';
import { useAddProduct } from '../hooks/useQueries';
import { type ProductListing } from '../backend';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const emptyProduct: ProductListing = {
  title: '',
  description: '',
  thumbnailUrl: '',
  amazonUrl: '',
  price: '',
};

export default function AddProductModal({ open, onClose }: AddProductModalProps) {
  const [form, setForm] = useState<ProductListing>(emptyProduct);
  const addProduct = useAddProduct();

  const handleChange = (field: keyof ProductListing, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amazonUrl.trim()) return;
    const product: ProductListing = {
      ...form,
      price: form.price?.trim() || undefined,
    };
    await addProduct.mutateAsync(product);
    setForm(emptyProduct);
    onClose();
  };

  const handleClose = () => {
    setForm(emptyProduct);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/20">
              <Package className="h-5 w-5 text-amber" />
            </div>
            <DialogTitle className="font-display text-xl">Add Product</DialogTitle>
          </div>
          <DialogDescription>
            Add an Amazon product to your showcase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="add-title">
              Product Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-title"
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-description">Description</Label>
            <Textarea
              id="add-description"
              placeholder="Why do you recommend this product?"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-price">Price (optional)</Label>
              <Input
                id="add-price"
                placeholder="$29.99"
                value={form.price ?? ''}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="add-thumbnailUrl"
                placeholder="https://…"
                value={form.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-amazonUrl">
              Amazon URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-amazonUrl"
              placeholder="https://www.amazon.com/dp/…"
              value={form.amazonUrl}
              onChange={(e) => handleChange('amazonUrl', e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber text-charcoal-dark hover:bg-amber-light font-semibold shadow-amber-glow"
              disabled={addProduct.isPending || !form.title.trim() || !form.amazonUrl.trim()}
            >
              {addProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding…
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
