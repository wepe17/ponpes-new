import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { User } from '../types';
import { handleApiError } from '../utils/error-handler';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const create = useMutation({
    mutationFn: (data: Omit<User, 'id'>) => usersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      usersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    onError: handleApiError,
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
};