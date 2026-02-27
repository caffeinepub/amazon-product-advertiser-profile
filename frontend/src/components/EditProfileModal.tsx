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
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { type UserProfile } from '../backend';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
}

export default function EditProfileModal({ open, onClose, currentProfile }: EditProfileModalProps) {
  const [form, setForm] = useState<UserProfile>(currentProfile);
  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (open) setForm(currentProfile);
  }, [open, currentProfile]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) return;
    await saveProfile.mutateAsync(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Edit Profile</DialogTitle>
          <DialogDescription>Update your public profile information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-displayName">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-displayName"
              value={form.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea
              id="edit-bio"
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-socialHandle">Social Handle</Label>
            <Input
              id="edit-socialHandle"
              placeholder="@yourhandle"
              value={form.socialHandle}
              onChange={(e) => handleChange('socialHandle', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-profilePhotoUrl">Profile Photo URL</Label>
            <Input
              id="edit-profilePhotoUrl"
              placeholder="https://example.com/photo.jpg"
              value={form.profilePhotoUrl}
              onChange={(e) => handleChange('profilePhotoUrl', e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-amber text-charcoal-dark hover:bg-amber-light font-semibold shadow-amber-glow"
              disabled={saveProfile.isPending || !form.displayName.trim()}
            >
              {saveProfile.isPending ? (
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
