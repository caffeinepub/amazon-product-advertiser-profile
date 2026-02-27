import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { type UserProfile } from '../backend';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [form, setForm] = useState<UserProfile>({
    displayName: '',
    bio: '',
    profilePhotoUrl: '',
    socialHandle: '',
  });

  const saveProfile = useSaveCallerUserProfile();

  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.displayName.trim()) return;
    await saveProfile.mutateAsync(form);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/20">
              <User className="h-5 w-5 text-amber" />
            </div>
            <DialogTitle className="font-display text-xl">Set Up Your Profile</DialogTitle>
          </div>
          <DialogDescription>
            Welcome! Tell us a bit about yourself to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="displayName"
              placeholder="e.g. Jane Smith"
              value={form.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell visitors about yourself and what you recommend…"
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="socialHandle">Social Handle</Label>
            <Input
              id="socialHandle"
              placeholder="@yourhandle"
              value={form.socialHandle}
              onChange={(e) => handleChange('socialHandle', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
            <Input
              id="profilePhotoUrl"
              placeholder="https://example.com/photo.jpg"
              value={form.profilePhotoUrl}
              onChange={(e) => handleChange('profilePhotoUrl', e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber text-charcoal-dark hover:bg-amber-light font-semibold shadow-amber-glow"
            disabled={saveProfile.isPending || !form.displayName.trim()}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving…
              </>
            ) : (
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
