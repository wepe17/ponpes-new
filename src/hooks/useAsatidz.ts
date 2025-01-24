import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asatidzApi } from '../api/asatidz';
import { Asatidz } from '../types';
import { handleApiError } from '../utils/error-handler';

export const useAsatidz = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['asatidz'],
    queryFn: asatidzApi.getAll,
  });

  const create = useMutation({
    mutationFn: (data: Omit<Asatidz, 'id'>) => asatidzApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asatidz'] }),
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asatidz> }) => 
      asatidzApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asatidz'] }),
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: asatidzApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['asatidz'] }),
    onError: handleApiError,
  });

  return {
    asatidz: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
};