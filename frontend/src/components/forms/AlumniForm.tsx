import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alumni } from "../../types";

const schema = z.object({
  name: z.string().min(1, "Nama Harus Diisi"),
  nis: z.string().min(1, "NIS harus diisi"),
  graduationYear: z.string().min(1, "Tahun Lulus harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  phoneNumber: z.string().min(1, "Nomor telepon harus diisi"),
  occupation: z.string().min(1, "Pekerjaan harus diisi"),
  email: z.string().email("Email salah"),
});

type FormData = z.infer<typeof schema>;

interface AlumniFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Alumni;
}

const AlumniForm: React.FC<AlumniFormProps> = ({ onSubmit, initialData }) => {
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
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input
          type="text"
          {...register("name")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">NIS</label>
        <input
          type="text"
          {...register("nis")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.nis && (
          <p className="mt-1 text-sm text-red-600">{errors.nis.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tahun Lulus
        </label>
        <input
          type="text"
          {...register("graduationYear")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.graduationYear && (
          <p className="mt-1 text-sm text-red-600">
            {errors.graduationYear.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Alamat
        </label>
        <textarea
          {...register("address")}
          rows={3}
          className="mt-1 block w-full  p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nomor Telepon
        </label>
        <input
          type="tel"
          {...register("phoneNumber")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pekerjaan Saat ini
        </label>
        <input
          type="text"
          {...register("occupation")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.occupation && (
          <p className="mt-1 text-sm text-red-600">
            {errors.occupation.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default AlumniForm;

