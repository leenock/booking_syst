"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  Globe,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";

enum LoginStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  SUSPICIOUS = "SUSPICIOUS",
}

type LoginLog = {
  id: number;
  email: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  status: LoginStatus;
};

const loginStatusIcons: Record<LoginStatus, React.ReactElement> = {
  [LoginStatus.SUCCESS]: <CheckCircle className="text-green-600" size={20} />,
  [LoginStatus.FAILED]: <AlertCircle className="text-red-600" size={20} />,
  [LoginStatus.SUSPICIOUS]: <Shield className="text-amber-600" size={20} />,
};

const statusClasses: Record<LoginStatus, string> = {
  [LoginStatus.SUCCESS]: "bg-green-100 text-green-800",
  [LoginStatus.FAILED]: "bg-red-100 text-red-800",
  [LoginStatus.SUSPICIOUS]: "bg-amber-100 text-amber-800",
};

export default function LoginLogsTable() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLoginLogs() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/login-activity"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch login logs");
        }

        const data = await response.json();

        let loginLogs: any[];

        if (Array.isArray(data)) {
          loginLogs = data;
        } else if (
          typeof data === "object" &&
          data !== null &&
          "data" in data &&
          Array.isArray(data.data)
        ) {
          loginLogs = data.data;
        } else if (
          typeof data === "object" &&
          data !== null &&
          "logs" in data &&
          Array.isArray(data.logs)
        ) {
          loginLogs = data.logs;
        } else {
          throw new Error("Unexpected API response structure");
        }

        // Map incoming data to LoginLog type
        const mappedData = loginLogs.map((log, index) => ({
          id: index + 1,
          email: log.email || "N/A",
          timestamp: new Date(log.createdAt || log.timestamp).toLocaleString(),
          ipAddress: log.ipAddress || "Unknown",
          device: log.device || "Unknown",
          status:
            Object.values(LoginStatus).includes(log.status) &&
            log.status !== undefined
              ? (log.status as LoginStatus)
              : LoginStatus.FAILED,
        }));

        setLogs(mappedData);
      } catch (err) {
        console.error(err);
        setError("Could not load login activity.");
      } finally {
        setLoading(false);
      }
    }

    fetchLoginLogs();
  }, []);

  const handleExportCSV = () => {
    if (!logs.length) {
      alert("No data available to export.");
      return;
    }

    const csvHeaders = [
      "ID",
      "Email",
      "Timestamp",
      "IP Address",
      "Device",
      "Status",
    ];
    const csvRows = logs.map((log) => [
      log.id,
      log.email,
      log.timestamp,
      log.ipAddress,
      log.device,
      log.status,
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "login_logs.csv";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-center text-gray-500">Loading login logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Login Activity Logs
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Monitor all authentication attempts in the system
            </p>
          </div>
          <div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
            >
              <Clock size={16} className="mr-2" />
              Refresh Logs
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing latest {logs.length} login attempts
          </div>
          <div className="flex gap-2">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              Success
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              Failed
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
              Suspicious
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 text-sm"
                >
                  No login activity found.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {log.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <User className="text-gray-500" size={20} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {log.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      <Globe size={16} className="mr-2 text-gray-400" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[log.status]}`}
                      >
                        {loginStatusIcons[log.status]}
                        <span className="ml-1">{log.status}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Login attempts are retained for 30 days. Export logs for longer
            retention.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
