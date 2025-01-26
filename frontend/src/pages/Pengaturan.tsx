import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Settings } from "../types";
import { useSettingStore } from "../store/setting";
import { sleep } from "../utils";
import { useToast } from "../hooks/useToast";

const schema = z.object({
  school_name: z.string().min(1, "School name is required"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  spp_amount: z.number().min(1, "SPP amount must be greater than 0"),
  registration_fee: z
    .number()
    .min(1, "Registration fee must be greater than 0"),
  // is_email_notification: z.number(),
  // is_sms_notification: z.number(),
});

type FormData = z.infer<typeof schema>;

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

const PengaturanPage = () => {
  const { setting, updateSetting, allSetting } = useSettingStore();
  const initialData: Settings | undefined = undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...setting,
      is_email_notification: setting.is_email_notification === 1,
      is_sms_notification: setting.is_sms_notification === 1,
    },
  });
  const { showToast, ToastComponent } = useToast();
  const [isEmailNotification, setIsEmailNotification] = useState(false);
  const [isSmsNotification, setIsSmsNotification] = useState(false);

  const onSubmit = async (data: Settings) => {
    data.is_email_notification = isEmailNotification ? 1 : 0;
    data.is_sms_notification = isSmsNotification ? 1 : 0;
    const resp = await updateSetting(data);
    console.log("resp", resp);
    if (resp.statusCode === 200)
      showToast("Setting updated successfully", "success");
  };

  useEffect(() => {
    allSetting({});
  }, [allSetting]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div>
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="School Name"
                error={errors.school_name?.message}
              >
                <input
                  {...register("school_name")}
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Address" error={errors.address?.message}>
                <input
                  {...register("address")}
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField
                label="Phone Number"
                error={errors.phone_number?.message}
              >
                <input
                  {...register("phone_number")}
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Payment Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Monthly SPP Amount"
                error={errors.spp_amount?.message}
              >
                <input
                  {...register("spp_amount", { valueAsNumber: true })}
                  type="number"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField
                label="Registration Fee"
                error={errors.registration_fee?.message}
              >
                <input
                  {...register("registration_fee", { valueAsNumber: true })}
                  type="number"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">System Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  onChange={(e) => setIsEmailNotification(e.target.checked)}
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Email Notifications
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  onChange={(e) => setIsSmsNotification(e.target.checked)}
                  type="checkbox"
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable SMS Notifications
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            // type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengaturanPage;

