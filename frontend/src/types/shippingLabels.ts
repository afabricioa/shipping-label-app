export interface ShippingLabel {
    id: number;
    shipment_id: string;
    carrier: string;
    service: string;
    rate: string;
    currency: string;
    tracking_code: string | null;
    label_url: string;
    label_pdf_url: string | null;
    status: string;
    created_at: string;
}