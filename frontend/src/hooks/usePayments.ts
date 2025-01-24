import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments';
import { Payment } from '../types';
import { handleApiError } from '../utils/error-handler';

export const usePayments = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });

  const create = useMutation({
    mutationFn: (data: Omit<Payment, 'id'>) => paymentsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) => 
      paymentsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: paymentsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] }),
    onError: handleApiError,
  });

  return {
    payments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
};