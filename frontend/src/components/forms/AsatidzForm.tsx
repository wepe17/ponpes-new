import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Asatidz } from "../../types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  nip: z.string().min(1, "NIP is required"),
  subject: z.string().min(1, "Subject is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  join_date: z.string().min(1, "Join date is required"),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof schema>;

interface AsatidzFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Asatidz;
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

const AsatidzForm: React.FC<AsatidzFormProps> = ({ onSubmit, initialData }) => {
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
        <FormField label="Name" error={errors.name?.message}>
          <input
            type="text"
            {...register("name")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="NIP" error={errors.nip?.message}>
          <input
            type="text"
            {...register("nip")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Subject" error={errors.subject?.message}>
          <input
            type="text"
            {...register("subject")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Join Date" error={errors.join_date?.message}>
          <input
            type="date"
            {...register("join_date")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <FormField label="Address" error={errors.address?.message}>
        <textarea
          {...register("address")}
          rows={3}
          className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Phone Number" error={errors.phone_number?.message}>
          <input
            type="tel"
            {...register("phone_number")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register("status")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FormField>
      </div>

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

export default AsatidzForm;

