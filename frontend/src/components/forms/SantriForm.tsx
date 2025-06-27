import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Santri } from "../../types";

const schema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  nis: z.string().min(1, "NIS harus diisi"),
  date_of_birth: z.string().min(1, "Tanggal Lahir harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  parent_name: z.string().min(1, "Nama Orangtua harus diisi"),
  phone_number: z.string().min(1, "Nomor Telepon harus diisi"),
  enrollment_date: z.string().min(1, "Tanggal Pendaftaran harus diisi"),
  class: z.string().min(1, "Kelas harus diisi"),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof schema>;

interface SantriFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Santri;
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

const SantriForm: React.FC<SantriFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nama Lengkap" error={errors.name?.message}>
          <input
            type="text"
            {...register("name")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="NIS" error={errors.nis?.message}>
          <input
            type="text"
            {...register("nis")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Tanggal Lahir" error={errors.date_of_birth?.message}>
          <input
            type="date"
            {...register("date_of_birth")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField
          label="Tanggal Pendaftaran"
          error={errors.enrollment_date?.message}
        >
          <input
            type="date"
            {...register("enrollment_date")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <FormField label="Alamat" error={errors.address?.message}>
        <textarea
          {...register("address")}
          rows={3}
          className="w-full border p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nama Orangtua" error={errors.parent_name?.message}>
          <input
            type="text"
            {...register("parent_name")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Nomor Telepon" error={errors.phone_number?.message}>
          <input
            type="tel"
            {...register("phone_number")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Kelas" error={errors.class?.message}>
          <input
            type="text"
            {...register("class")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register("status")}
            className="w-full border h-10 p-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </FormField>
      </div>

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

export default SantriForm;

