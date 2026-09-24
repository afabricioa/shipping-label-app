<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingLabel extends Model
{
    protected $fillable = [
        'user_id',
        'easypost_shipment_id',
        'easypost_rate_id',
        'carrier',
        'service',
        'rate',
        'currency',
        'tracking_code',
        'label_url',
        'label_pdf_url',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
