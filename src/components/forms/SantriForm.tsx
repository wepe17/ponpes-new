import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Santri } from '../../types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  nis: z.string().min(1, 'NIS is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  class: z.string().min(1, 'Class is required'),
  status: z.enum(['active', 'inactive'])
});

type FormData = z.infer<typeof schema>;

interface SantriFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Santri;
}

const FormField = ({ 
  label, 
  error, 
  children 
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Name" error={errors.name?.message}>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="NIS" error={errors.nis?.message}>
          <input
            type="text"
            {...register('nis')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Date of Birth" error={errors.dateOfBirth?.message}>
          <input
            type="date"
            {...register('dateOfBirth')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Enrollment Date" error={errors.enrollmentDate?.message}>
          <input
            type="date"
            {...register('enrollmentDate')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <FormField label="Address" error={errors.address?.message}>
        <textarea
          {...register('address')}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Parent Name" error={errors.parentName?.message}>
          <input
            type="text"
            {...register('parentName')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Phone Number" error={errors.phoneNumber?.message}>
          <input
            type="tel"
            {...register('phoneNumber')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Class" error={errors.class?.message}>
          <input
            type="text"
            {...register('class')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          />
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register('status')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
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

export default SantriForm;