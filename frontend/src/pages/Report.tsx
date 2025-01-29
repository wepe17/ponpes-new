import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import Pagination from "../components/Pagination";
import { useReportStore } from "../store/report";
import { formatDate, formatToIDR } from "../utils";
import { exportToExcel } from "../config/excel";

const ReportPage = () => {
  const { report, allReport, pagination } = useReportStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReport = report;

  const exportExcel = () => {
    const data = report.map((s) => ({
      "Kas Amount": s.kas_amount,
      "Kas Date": s.kas_date,
      "Kas Description": s.kas_description,
    }));
    exportToExcel(data, "data-kas.xlsx");
  };

  useEffect(() => {
    allReport({});
  }, [allReport]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Report</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Transaction
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or NIS..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KAS Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KAS Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KAS Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReport.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    {formatToIDR(Number(report.kas_amount))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(report.created_at).fullDate} -{" "}
                    {formatDate(report.created_at).time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.kas_description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages || 1}
            onPageChange={(page) => allReport({ page })}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
