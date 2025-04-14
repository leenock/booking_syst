"use client";

import { Banknote, CreditCard, Building } from "lucide-react";

enum PaymentMethod {
  CASH = "CASH",
  MPESA = "MPESA",
  BANK_TRANSFER = "BANK_TRANSFER"
}

const paymentMethodDescriptions: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Cash payment at the premises",
  [PaymentMethod.MPESA]: "Pay using M-Pesa mobile transfer",
  [PaymentMethod.BANK_TRANSFER]: "Direct bank account transfer"
};

const paymentMethodIcons: Record<PaymentMethod, React.ReactElement> = {
  [PaymentMethod.CASH]: <Banknote className="text-green-600" size={20} />,
  [PaymentMethod.MPESA]: <CreditCard className="text-blue-600" size={20} />,
  [PaymentMethod.BANK_TRANSFER]: <Building className="text-purple-600" size={20} />
};

export default function PaymentMethodsTable() {
  const methods = Object.values(PaymentMethod);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Payment Methods</h2>
        <p className="text-sm text-gray-500 mt-2">Choose from our secure and convenient payment options</p>
      </div>

      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method, index) => (
              <tr 
                key={method} 
                className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">{index + 1}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {paymentMethodIcons[method as PaymentMethod]}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{method}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-700">
                  {paymentMethodDescriptions[method as PaymentMethod]}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            All payments are processed securely. Contact support for assistance with payment methods.
          </p>
        </div>
      </div>
    </div>
  );
}