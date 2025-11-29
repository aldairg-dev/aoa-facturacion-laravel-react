<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'user_id'   => 'required|exists:users,id',
            'invoice_type' => 'required|string|in:credit,cash',
            'details' => 'required|array|min:1',
            'details.*.product_code' => 'required|string',
            'details.*.product_name' => 'required|string',
            'details.*.unit_price'   => 'required|numeric|min:0',
            'details.*.quantity'     => 'required|integer|min:1',
            'details.*.applies_tax'  => 'required|boolean',
        ];
    }
}
