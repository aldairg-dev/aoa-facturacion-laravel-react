<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use App\Models\InvoiceDetails;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $invoices = Invoice::orderBy('id', 'asc')->get();

            return response()->json([
                'success' => true,
                'data'    => $invoices,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las facturas',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InvoiceRequest $request)
    {
        try {
            $invoice = Invoice::orderBy('id', 'desc')->first();
            $number = $invoice ? $invoice->id + 1 : 1;
            $serial = '000-' . str_pad($number, 4, '0', STR_PAD_LEFT);

            $dueDate = $request->invoice_type === 'credit'
                ? Carbon::now()->addDays(30)->toDateString()
                : Carbon::now()->toDateString();

            DB::beginTransaction();

            $invoice = Invoice::create([
                'invoice_number' => $serial,
                'client_id'      => $request->client_id,
                'user_id'        => $request->user_id,
                'due_date'       => $dueDate,
                'invoice_date'   => Carbon::now()->toDateString(),
                'invoice_type'   => $request->invoice_type,
                'subtotal'       => 0,
                'tax_total'      => 0,
                'total'          => 0,
            ]);
            $subtotalGeneral = 0;
            $taxGeneral = 0;
            $totalGeneral = 0;

            foreach ($request->details as $detail) {

                $subtotal = $detail['unit_price'] * $detail['quantity'];

                $taxAmount = $detail['applies_tax']
                    ? $subtotal * 0.19
                    : 0;

                $total = $subtotal + $taxAmount;

                $subtotalGeneral += $subtotal;
                $taxGeneral += $taxAmount;
                $totalGeneral += $total;

                InvoiceDetails::create([
                    'invoice_id'    => $invoice->id,
                    'product_code'  => $detail['product_code'],
                    'product_name'  => $detail['product_name'],
                    'unit_price'    => $detail['unit_price'],
                    'quantity'      => $detail['quantity'],
                    'applies_tax'   => $detail['applies_tax'],
                    'tax_amount'    => $taxAmount,
                    'subtotal'      => $subtotal,
                    'total'         => $total,
                ]);
            }

            $invoice->update([
                'subtotal'  => $subtotalGeneral,
                'tax_total' => $taxGeneral,
                'total'     => $totalGeneral,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Factura creada correctamente',
                'invoice' => $invoice
            ], 201);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la factura',
                'error'   => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        try {
            $invoice->load(['invoiceDetails', 'client', 'user']);

            return response()->json([
                'success' => true,
                'data'    => $invoice
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la factura',
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        //
    }
}
