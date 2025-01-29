import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "../../types";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "staff"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

interface UserFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Omit<User, "id">;
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

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData }) => {
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
      <FormField label="Username" error={errors.username?.message}>
        <input
          type="text"
          {...register("username")}
          className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <FormField label="Name" error={errors.name?.message}>
        <input
          type="text"
          {...register("name")}
          className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <FormField label="Role" error={errors.role?.message}>
        <select
          {...register("role")}
          className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </FormField>

      {!initialData && (
        <FormField label="Password" error={errors.password?.message}>
          <input
            type="password"
            {...register("password")}
            className="w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      )}

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

export default UserForm;

