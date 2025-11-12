import { LeadInput } from "./validation";

const GRAPH_API_VERSION = "v19.0";

type WhatsAppResponse = {
  success: boolean;
  status?: number;
  requestId?: string;
  detail?: string;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
};

export async function sendWhatsAppLeadMessage(
  payload: LeadInput
): Promise<WhatsAppResponse> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return {
      success: false,
      detail:
        "Missing WhatsApp credentials. Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID."
    };
  }

  const requestId = crypto.randomUUID();
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: payload.phoneNumber,
    type: "text",
    text: {
      body: formatMessage(payload)
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Request-ID": requestId
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let error: WhatsAppResponse["error"];

    try {
      const data = await response.json();
      error = data.error;
    } catch {
      error = {
        message: response.statusText,
        type: "UnknownError",
        code: response.status
      };
    }

    return {
      success: false,
      status: response.status,
      requestId,
      error
    };
  }

  return {
    success: true,
    status: response.status,
    requestId
  };
}

function formatMessage(payload: LeadInput): string {
  const lines = [
    `New form registration from ${payload.fullName}.`,
    payload.email ? `Email: ${payload.email}` : undefined,
    `Phone: ${payload.phoneNumber}`,
    "",
    payload.message
  ].filter(Boolean);

  return lines.join("\n");
}
