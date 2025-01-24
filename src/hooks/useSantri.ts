import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { santriApi } from '../api/santri';
import { Santri } from '../types';

export const useSantri = () => {
  const queryClient = useQueryClient();

  const santriQuery = useQuery({
    queryKey: ['santri'],
    queryFn: santriApi.getAll,
  });

  const createSantri = useMutation({
    mutationFn: (data: Omit<Santri, 'id'>) => santriApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
    },
  });

  const updateSantri = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Santri> }) =>
      santriApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
    },
  });

  const deleteSantri = useMutation({
    mutationFn: santriApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santri'] });
    },
  });

  return {
    santri: santriQuery.data ?? [],
    isLoading: santriQuery.isLoading,
    error: santriQuery.error,
    createSantri,
    updateSantri,
    deleteSantri,
  };
};