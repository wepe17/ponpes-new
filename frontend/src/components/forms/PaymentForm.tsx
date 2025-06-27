import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Payment, Santri } from "../../types";

const schema = z.object({
  // santri_id: z.string().min(1, "Student ID is required"),
  amount: z.number().min(1, "Jumlah harus lebih besar dari 0"),
  date: z.string().min(1, "Tanggal harus diisi"),
  type: z.enum(["SPP", "Registration", "Other"]),
  status: z.enum(["paid", "pending"]),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface PaymentFormProps {
  onSubmit: (data: FormData) => void;
  onClick: () => void;
  initialData?: Payment;
  selectedSantri?: Santri;
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

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  onClick,
  initialData,
  selectedSantri,
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
      // santri_id: selectedSantri?.id || initialData?.santri_id,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="ID Santri">
        <input
          type="text"
          // {...register("santri_id")}
          className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          readOnly
          value={selectedSantri?.name}
          onClick={onClick}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Jumlah" error={errors.amount?.message}>
          <input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Tanggal" error={errors.date?.message}>
          <input
            type="date"
            {...register("date")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Tipe" error={errors.type?.message}>
          <select
            {...register("type")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="SPP">SPP</option>
            <option value="Registration">Pendaftaran</option>
            <option value="Other">Lainnya</option>
          </select>
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register("status")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="paid">Sudah Bayar</option>
            <option value="pending">Pending</option>
          </select>
        </FormField>
      </div>

      <FormField label="Deskripsi" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
