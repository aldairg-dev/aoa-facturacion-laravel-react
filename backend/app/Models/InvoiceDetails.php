<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'product_code',
        'product_name',
        'unit_price',
        'quantity',
        'applies_tax',
        'tax_amount',
        'subtotal',
        'total',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
