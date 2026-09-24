<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateShippingLabelRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'to_address.name' => ['required', 'string', 'max:255'],
            'to_address.street1' => ['required', 'string', 'max:255'],
            'to_address.city' => ['required', 'string', 'max:255'],
            'to_address.state' => ['required', 'string', 'max:2'],
            'to_address.zip' => ['required', 'string', 'max:20'],
            'to_address.country' => ['required', 'string', 'max:2', 'in:US'],
            'to_address.phone' => ['required', 'string', 'max:30'],
            'to_address.email' => ['required', 'string', 'max:255'],

            'from_address.name' => ['required', 'string', 'max:255'],
            'from_address.street1' => ['required', 'string', 'max:255'],
            'from_address.city' => ['required', 'string', 'max:255'],
            'from_address.state' => ['required', 'string', 'max:2'],
            'from_address.zip' => ['required', 'string', 'max:20'],
            'from_address.country' => ['required', 'string', 'max:2', 'in:US'],
            'from_address.phone' => ['required', 'string', 'max:30'],
            'from_address.email' => ['required', 'string', 'max:255'],

            'parcel.length' => ['required', 'numeric', 'gt:0'],
            'parcel.width' => ['required', 'numeric', 'gt:0'],
            'parcel.height' => ['required', 'numeric', 'gt:0'],
            'parcel.weight' => ['required', 'numeric', 'gt:0'],
        ];
    }
}
