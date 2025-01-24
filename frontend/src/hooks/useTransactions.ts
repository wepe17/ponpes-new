import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions';
import { Transaction } from '../types';
import { handleApiError } from '../utils/error-handler';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsApi.getAll,
  });

  const create = useMutation({
    mutationFn: (data: Omit<Transaction, 'id'>) => transactionsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    onError: handleApiError,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) => 
      transactionsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    onError: handleApiError,
  });

  const remove = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    onError: handleApiError,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
};