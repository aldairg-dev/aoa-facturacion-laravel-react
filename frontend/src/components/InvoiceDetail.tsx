import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import html2pdf from "html2pdf.js";
import { FileDown, X } from "lucide-react";

interface Client {
  client_identification: string;
  client_name: string;
  email: string;
}

interface InvoiceDetail {
  id: number;
  product_code: string;
  product_name: string;
  unit_price: string;
  quantity: number;
  applies_tax: number;
  tax_amount: string;
  subtotal: string;
  total: string;
}

interface Invoice {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  invoice_type: string;
  subtotal: string;
  tax_total: string;
  total: string;
  invoice_details: InvoiceDetail[];
  client: Client;
}

interface Props {
  open: boolean;
  invoiceId: string | null;
  onClose: () => void;
}

export default function InvoiceModal({ open, invoiceId, onClose }: Props) {
  const [factura, setFactura] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!pdfRef.current || !factura) return;

    setDownloading(true);

    setTimeout(() => {
      try {
        const element = pdfRef.current;
        if (!element) {
          throw new Error("Elemento no encontrado");
        }

        html2pdf()
          .set({
            margin: 10,
            filename: `Factura-${factura.invoice_number}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(element)
          .save()
          .then(() => {
            setDownloading(false);
          })
          .catch((error) => {
            console.error("Error al generar PDF:", error);
            alert("Error al generar el PDF. Por favor intenta de nuevo.");
            setDownloading(false);
          });
      } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error al generar el PDF. Por favor intenta de nuevo.");
        setDownloading(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (!open || !invoiceId) return;

    const loadFactura = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/invoices/${invoiceId}`);
        setFactura(res.data.data);
      } catch (error) {
        console.error("Error al cargar factura:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFactura();
  }, [open, invoiceId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            <p className="mt-4 text-slate-600">Cargando factura...</p>
          </div>
        )}

        {/* No encontrada */}
        {!loading && !factura && (
          <p className="text-center py-6 text-red-600">
            Factura no encontrada.
          </p>
        )}

        {factura && (
          <>
            {/* CONTENIDO DEL PDF */}
            <div
              ref={pdfRef}
              style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
              }}
            >
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "32px",
                }}
              >
                Factura #{factura.invoice_number}
              </h1>

              {/* DATOS CLIENTE */}
              <section style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "12px",
                    borderBottom: "1px solid #cbd5e1",
                    paddingBottom: "8px",
                  }}
                >
                  Datos del Cliente
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    color: "#334155",
                  }}
                >
                  <p>
                    <span style={{ fontWeight: "500" }}>Nombre:</span>{" "}
                    {factura.client.client_name}
                  </p>
                  <p>
                    <span style={{ fontWeight: "500" }}>Identificación:</span>{" "}
                    {factura.client.client_identification}
                  </p>
                  <p>
                    <span style={{ fontWeight: "500" }}>Email:</span>{" "}
                    {factura.client.email}
                  </p>
                  <p>
                    <span style={{ fontWeight: "500" }}>Tipo:</span>{" "}
                    {factura.invoice_type}
                  </p>
                </div>
              </section>

              {/* INFO FACTURA */}
              <section style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "12px",
                    borderBottom: "1px solid #cbd5e1",
                    paddingBottom: "8px",
                  }}
                >
                  Información de Factura
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    color: "#334155",
                  }}
                >
                  <p>
                    <span style={{ fontWeight: "500" }}>Fecha:</span>{" "}
                    {factura.invoice_date}
                  </p>
                  <p>
                    <span style={{ fontWeight: "500" }}>Vencimiento:</span>{" "}
                    {factura.due_date}
                  </p>
                </div>
              </section>

              {/* DETALLE */}
              <section style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "12px",
                    borderBottom: "1px solid #cbd5e1",
                    paddingBottom: "8px",
                  }}
                >
                  Detalle de Productos
                </h2>
                <table
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead style={{ backgroundColor: "#f1f5f9" }}>
                    <tr>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "left",
                          color: "#334155",
                        }}
                      >
                        Código
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "left",
                          color: "#334155",
                        }}
                      >
                        Producto
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "center",
                          color: "#334155",
                        }}
                      >
                        Cant.
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "right",
                          color: "#334155",
                        }}
                      >
                        Unitario
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "right",
                          color: "#334155",
                        }}
                      >
                        IVA
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "right",
                          color: "#334155",
                        }}
                      >
                        Subtotal
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          border: "1px solid #cbd5e1",
                          textAlign: "right",
                          color: "#334155",
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {factura.invoice_details.map((d, i) => (
                      <tr
                        key={d.id}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            color: "#334155",
                          }}
                        >
                          {d.product_code}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            color: "#334155",
                          }}
                        >
                          {d.product_name}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            textAlign: "center",
                            color: "#334155",
                          }}
                        >
                          {d.quantity}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            textAlign: "right",
                            color: "#334155",
                          }}
                        >
                          ${parseFloat(d.unit_price).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            textAlign: "right",
                            color: "#334155",
                          }}
                        >
                          {d.applies_tax === 1
                            ? `${parseFloat(d.tax_amount).toLocaleString()}`
                            : "$0"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            textAlign: "right",
                            color: "#334155",
                          }}
                        >
                          ${parseFloat(d.subtotal).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #cbd5e1",
                            textAlign: "right",
                            fontWeight: "600",
                            color: "#1e293b",
                          }}
                        >
                          ${parseFloat(d.total).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* TOTALES */}
              <section style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    width: "288px",
                    backgroundColor: "#f8fafc",
                    padding: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #cbd5e1",
                      color: "#1e293b",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>Subtotal:</span>
                    <span>
                      ${parseFloat(factura.subtotal).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #cbd5e1",
                      color: "#1e293b",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>IVA:</span>
                    <span>
                      ${parseFloat(factura.tax_total).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#0f172a",
                    }}
                  >
                    <span>Total:</span>
                    <span>${parseFloat(factura.total).toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* BOTÓN DESCARGAR */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={downloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Descargar PDF
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
