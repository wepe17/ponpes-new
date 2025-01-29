import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Transaction } from "../../types";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Transaction;
}

const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialData,
      amount: initialData?.amount || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div
        className={`grid grid-cols-1  gap-4 ${!initialData?.amount ? "md:grid-cols-2" : ""}`}
      >
        <FormField label="Date" error={errors.date?.message}>
          <input
            type="date"
            {...register("date")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        {!initialData?.amount && (
          <FormField label="Amount" error={errors.amount?.message}>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </FormField>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Type" error={errors.type?.message}>
          <select
            {...register("type")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </FormField>

        <FormField label="Category" error={errors.category?.message}>
          <input
            type="text"
            {...register("category")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full  p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
