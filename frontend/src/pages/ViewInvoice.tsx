import { useParams } from "react-router-dom";

export default function ViewInvoice() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Detalle de Factura #{id}</h1>
    </div>
  );
}
