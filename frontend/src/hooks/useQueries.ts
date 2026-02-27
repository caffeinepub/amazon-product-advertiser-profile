import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type UserProfile, type ProductListing } from '../backend';
import { Principal } from '@dfinity/principal';
import { useInternetIdentity } from './useInternetIdentity';

// ─── User Profile Queries ────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}

export function useGetUserProfile(principal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Product Queries ─────────────────────────────────────────────────────────

export function useGetProducts(principal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductListing[]>({
    queryKey: ['products', principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      return actor.getProducts(Principal.fromText(principal));
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (product: ProductListing) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ['products', principal] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ index, product }: { index: number; product: ProductListing }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(BigInt(index), product);
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ['products', principal] });
    },
  });
}

export function useRemoveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeProduct(BigInt(index));
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ['products', principal] });
    },
  });
}
