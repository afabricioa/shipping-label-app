<?php

namespace App\Services\EasyPost;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class EasyPostService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.easypost.api_key');
        $this->baseUrl = config('services.easypost.base_url');
    }

    public function createShipment(array $shipmentData): array
    {
        $response = $this->client()
            ->post('/shipments', [
                'shipment' => $shipmentData,
            ]);

        return $response
            ->throw()
            ->json();
    }

    public function buyShipment(
        string $shipmentId,
        string $rateId
    ): array {
        $response = $this->client()
            ->post("/shipments/{$shipmentId}/buy", [
                'rate' => [
                    'id' => $rateId,
                ],
            ]);

        return $response
            ->throw()
            ->json();
    }

    private function client()
    {
        return Http::withBasicAuth(
            $this->apiKey,
            ''
        )
            ->acceptJson()
            ->asJson()
            ->baseUrl($this->baseUrl)
            ->timeout(30);
    }
}
