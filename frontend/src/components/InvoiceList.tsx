import { useEffect, useState } from "react";
import api from "../services/api";
import InvoiceModal from "../components/InvoiceDetail";

interface Client {
  client_identification: string;
  client_name: string;
  email: string;
}

interface User {
  name: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  invoice_date: string;
  due_date: string;
  invoice_type: string;
  subtotal: string;
  tax_total: string;
  total: string;
  client: Client;
  user: User;
}

export default function InvoiceList() {
  const [facturas, setFacturas] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const [openInvoice, setOpenInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const openModal = (id: string) => {
    setSelectedInvoice(id);
    setOpenInvoice(true);
  };

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const res = await api.get("/invoices");
        setFacturas(res.data.data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacturas();
  }, []);

  if (loading)
    return (
      <p className="text-center py-6 text-slate-600">Cargando facturas...</p>
    );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow-md">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-sm">
              <th className="p-3 border border-slate-300 text-left">#</th>
              <th className="p-3 border border-slate-300 text-left">Cliente</th>
              <th className="p-3 border border-slate-300 text-left">
                Atendido por
              </th>
              <th className="p-3 border border-slate-300 text-left">Fecha</th>
              <th className="p-3 border border-slate-300 text-left">
                Vencimiento
              </th>
              <th className="p-3 border border-slate-300 text-left">Tipo</th>
              <th className="p-3 border border-slate-300 text-left">
                Subtotal
              </th>
              <th className="p-3 border border-slate-300 text-left">IVA</th>
              <th className="p-3 border border-slate-300 text-left">Total</th>
              <th className="p-3 border border-slate-300 text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((f, i) => (
              <tr
                key={f.invoice_number}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                } hover:bg-slate-100 transition-colors`}
              >
                <td className="p-3 border border-slate-300 text-slate-700 font-medium">
                  {f.invoice_number}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700">
                  {f.client?.client_name}
                </td>
                <td className="p-3 border border-slate-300 text-slate-700">
                  {f.user?.name}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700">
                  {f.invoice_date}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700">
                  {f.due_date}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700 capitalize">
                  {f.invoice_type}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700">
                  ${parseFloat(f.subtotal).toLocaleString()}
                </td>

                <td className="p-3 border border-slate-300 text-slate-700">
                  ${parseFloat(f.tax_total).toLocaleString()}
                </td>

                <td className="p-3 border border-slate-300 font-semibold text-slate-800">
                  ${parseFloat(f.total).toLocaleString()}
                </td>

                <td className="p-3 border border-slate-300 text-center">
                  <button
                    onClick={() => openModal(f.invoice_number)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceModal
        open={openInvoice}
        invoiceId={selectedInvoice}
        onClose={() => setOpenInvoice(false)}
      />
    </>
  );
}
