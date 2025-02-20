import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Settings } from "../types";
import { useSettingStore } from "../store/setting";
import { useToast } from "../hooks/useToast";

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
  const { showToast, ToastComponent } = useToast();
  const [payload, setPayload] = useState<Settings>(setting);

  const onSubmit = async () => {
    const resp = await updateSetting(payload);
    if (resp.statusCode === 200)
      showToast("Setting updated successfully", "success");
  };

  useEffect(() => {
    allSetting({});
  }, [allSetting]);

  useEffect(() => {
    if (setting) {
      setPayload(setting);
    }
  }, [setting]);

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
              <FormField label="School Name">
                <input
                  value={payload?.school_name || ""}
                  onChange={(e) =>
                    setPayload({ ...payload, school_name: e.target.value })
                  }
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Address">
                <input
                  value={payload?.address || ""}
                  onChange={(e) =>
                    setPayload({ ...payload, address: e.target.value })
                  }
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Phone Number">
                <input
                  value={payload?.phone_number || ""}
                  onChange={(e) =>
                    setPayload({ ...payload, phone_number: e.target.value })
                  }
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Email">
                <input
                  value={payload?.email || ""}
                  onChange={(e) =>
                    setPayload({ ...payload, email: e.target.value })
                  }
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
              <FormField label="Monthly SPP Amount">
                <input
                  value={payload?.spp_amount || ""}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      spp_amount: Number(e.target.value),
                    })
                  }
                  type="number"
                  className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                />
              </FormField>
            </div>
            <div>
              <FormField label="Registration Fee">
                <input
                  value={payload?.registration_fee || ""}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      registration_fee: Number(e.target.value),
                    })
                  }
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
                  value={payload?.is_email_notification || ""}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      is_email_notification: e.target.checked ? 1 : 0,
                    })
                  }
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
                  value={payload?.is_sms_notification || ""}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      is_sms_notification: e.target.checked ? 1 : 0,
                    })
                  }
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
            onClick={onSubmit}
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
