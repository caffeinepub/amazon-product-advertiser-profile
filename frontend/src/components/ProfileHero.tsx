import React, { useState } from 'react';
import { Pencil, AtSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { type UserProfile } from '../backend';
import EditProfileModal from './EditProfileModal';

interface ProfileHeroProps {
  profile: UserProfile | null | undefined;
  isLoading: boolean;
  isOwner: boolean;
}

export default function ProfileHero({ profile, isLoading, isOwner }: ProfileHeroProps) {
  const [editOpen, setEditOpen] = useState(false);

  const initials = profile?.displayName
    ? profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <>
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-charcoal-dark">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1200x400.png')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/60 via-charcoal-dark/70 to-charcoal-dark" />

        <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isLoading ? (
                <Skeleton className="h-28 w-28 rounded-full bg-white/10" />
              ) : (
                <Avatar className="h-28 w-28 ring-4 ring-amber shadow-amber-glow">
                  {profile?.profilePhotoUrl ? (
                    <AvatarImage src={profile.profilePhotoUrl} alt={profile.displayName} />
                  ) : null}
                  <AvatarFallback className="bg-amber/20 text-amber text-3xl font-display font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48 bg-white/10 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-72 bg-white/10 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-32 bg-white/10 mx-auto md:mx-0" />
                </div>
              ) : profile ? (
                <div className="animate-fade-in">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  {profile.bio && (
                    <p className="mt-2 text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                  {profile.socialHandle && (
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-amber font-medium">
                      <AtSign className="h-4 w-4" />
                      <span>{profile.socialHandle.replace(/^@/, '')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-white/40 tracking-tight">
                    No profile yet
                  </h1>
                  <p className="mt-2 text-white/40 text-base">
                    {isOwner ? 'Log in to set up your profile.' : 'This profile has not been set up yet.'}
                  </p>
                </div>
              )}
            </div>

            {/* Edit Button */}
            {isOwner && profile && (
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Amber accent bar */}
          <div className="mt-8 h-0.5 w-24 bg-amber rounded-full mx-auto md:mx-0 opacity-80" />
        </div>
      </section>

      {/* Edit Modal */}
      {isOwner && profile && (
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          currentProfile={profile}
        />
      )}
    </>
  );
}
