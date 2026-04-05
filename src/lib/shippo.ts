const SHIPPO_API_URL = 'https://api.goshippo.com';

export async function getShippingRates(params: {
  fromAddress: { name: string; street1: string; city: string; state: string; zip: string; country: string };
  toAddress: { name: string; street1: string; city: string; state: string; zip: string; country: string };
  parcel: { length: string; width: string; height: string; weight: string; mass_unit: string; distance_unit: string };
}) {
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) return null;

  // Create shipment
  const shipmentRes = await fetch(`${SHIPPO_API_URL}/shipments`, {
    method: 'POST',
    headers: {
      'Authorization': `ShippoToken ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address_from: params.fromAddress,
      address_to: params.toAddress,
      parcels: [params.parcel],
      async: false,
    }),
  });

  const shipment = await shipmentRes.json();
  return shipment.rates || [];
}

export async function createShippingLabel(rateId: string) {
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) throw new Error('Shippo not configured');

  const res = await fetch(`${SHIPPO_API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `ShippoToken ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rate: rateId,
      label_file_type: 'PDF',
      async: false,
    }),
  });

  return res.json();
}
