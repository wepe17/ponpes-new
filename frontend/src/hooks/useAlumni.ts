import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumniApi } from '../api/alumni';
import { Alumni } from '../types';
import { handleApiError } from '../utils/error-handler';

export const useAlumni = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['alumni'],
    queryFn: alumniApi.getAll,
  });

  const create = useMutation({
    mutationFn: (data: Omit<Alumni, 'id'>) => alumniApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alumni'] }),
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Alumni> }) => 
      alumniApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alumni'] }),
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: alumniApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alumni'] }),
    onError: handleApiError,
  });

  return {
    alumni: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
};