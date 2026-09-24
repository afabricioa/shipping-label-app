<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateShippingLabelRequest;
use App\Services\EasyPost\EasyPostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentLabelController extends Controller
{
    public function __construct(
        private readonly EasyPostService $easyPostService
    ){}

    public function store(
        CreateShippingLabelRequest $request
    ): JsonResponse {
        $shipment = $this->easyPostService->createShipment(
            $request->validated()
        );

        $cheapestRate = collect($shipment['rates'] ?? [])
            ->filter(
                fn (array $rate) => ($rate['carrier'] ?? null) === 'USPS'
            )
            ->sortBy(
                fn (array $rate) => (float) $rate['rate']
            )
            ->first();

        if (!$cheapestRate) {
            return response()->json([
                'message' => 'No USPS rate available'
            ], 422);
        }

        $purchasedShipment = $this->easyPostService->buyShipment(
            $shipment['id'],
            $cheapestRate['id']
        );

        $postageLabel = $purchasedShipment['postage_label'] ?? null;

        if (!$postageLabel) {
            return response()->json([
                'message' => 'Easypost did not return a postage label.'
            ], 502);
        }

        $shippingLabel = $request->user()
            ->shippingLabels()
            ->create([
                'easypost_shipment_id' => $purchasedShipment['id'],
                'easypost_rate_id' => $cheapestRate['id'],
                'carrier' => $cheapestRate['carrier'],
                'service' => $cheapestRate['service'],
                'rate' => $cheapestRate['rate'],
                'currency' => $cheapestRate['currency'],
                'tracking_code' => $purchasedShipment['tracking_code'],
                'label_url' =>  $postageLabel['label_url'],
                'label_pdf_url' => $postageLabel['label_pdf_url'] ?? null,
                'status' => 'PURCHASED'
            ]);

        return response()->json([
            'id' => $shippingLabel->id,
            'shipment_id' => $shippingLabel->easypost_shipment_id,
            'carrier' => $shippingLabel->carrier,
            'service' => $shippingLabel->service,
            'rate' => $shippingLabel->rate,
            'currency' => $shippingLabel->currency,
            'tracking_code' => $shippingLabel->tracking_code,
            'label_url' => $shippingLabel->label_url,
            'label_pdf_url' => $shippingLabel->label_pdf_url,
            'status' => $shippingLabel->status,
        ], 201);
    }

    public function index(): JsonResponse
    {
        $shipppingLabels = request()
            ->user()
            ->shippingLabels()
            ->latest()
            ->get();

        return response()->json($shipppingLabels);
    }

    public function show(int $id): JsonResponse
    {
        $shippingLabel = request()
            ->user()
            ->shippingLabels()
            ->findOrFail($id);

        return response()->json($shippingLabel);
    }
}
