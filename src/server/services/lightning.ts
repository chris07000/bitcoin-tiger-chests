import axios from 'axios';

// Voltage configuration
const VOLTAGE_API_ENDPOINT = process.env.NEXT_PUBLIC_VOLTAGE_API_ENDPOINT;
const VOLTAGE_REST_PORT = process.env.VOLTAGE_REST_PORT;
const VOLTAGE_INVOICE_MACAROON = process.env.VOLTAGE_INVOICE_MACAROON;

if (!VOLTAGE_API_ENDPOINT || !VOLTAGE_REST_PORT || !VOLTAGE_INVOICE_MACAROON) {
  console.error('Missing required environment variables:', {
    endpoint: !!VOLTAGE_API_ENDPOINT,
    port: !!VOLTAGE_REST_PORT,
    macaroon: !!VOLTAGE_INVOICE_MACAROON
  });
}

const VOLTAGE_BASE_URL = `https://${VOLTAGE_API_ENDPOINT}:${VOLTAGE_REST_PORT}`;

interface VoltageInvoice {
  settled: boolean;
  amt_paid_sat: string;
  payment_request: string;
  r_hash: string;
  state: string;
  value: string;
  memo: string;
  creation_date: string;
  expiry: string;
}

interface CreateInvoiceResponse {
  paymentRequest: string;
  paymentHash: string;
  expiry: string;
}

interface PaymentStatus {
  paid: boolean;
  amount?: number;
  state: string;
}

function base64ToHex(base64: string): string {
  // Remove any base64 padding
  const cleanBase64 = base64.replace(/=+$/, '');
  // Convert to a buffer
  const buffer = Buffer.from(cleanBase64, 'base64');
  // Convert to hex
  return buffer.toString('hex');
}

export async function createInvoice(amount: number, memo?: string): Promise<CreateInvoiceResponse> {
  try {
    console.log('Creating invoice with Voltage:', {
      url: VOLTAGE_BASE_URL,
      amount,
      memo
    });

    const response = await axios.post<VoltageInvoice>(
      `${VOLTAGE_BASE_URL}/v1/invoices`,
      {
        value: amount,
        memo: memo || 'Bitcoin Tiger Chests Payment',
        expiry: 3600
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Grpc-Metadata-macaroon': VOLTAGE_INVOICE_MACAROON
        }
      }
    );

    console.log('Voltage invoice response:', {
      payment_request: response.data.payment_request?.substring(0, 20) + '...',
      r_hash: response.data.r_hash,
      expiry: response.data.expiry
    });

    // Validate the payment request format
    if (!response.data.payment_request?.startsWith('ln')) {
      throw new Error('Invalid payment request format received from Voltage');
    }

    return {
      paymentRequest: response.data.payment_request,
      paymentHash: response.data.r_hash,
      expiry: response.data.expiry
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Voltage API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error creating invoice:', error);
    }
    throw new Error('Failed to create invoice');
  }
}

export async function checkPayment(hash: string): Promise<PaymentStatus> {
  try {
    console.log('Checking payment status with Voltage:', {
      url: VOLTAGE_BASE_URL,
      hash
    });

    // Convert base64 hash to hex
    const hexHash = base64ToHex(hash);
    console.log('Converted hash to hex:', hexHash);

    const response = await axios.get<VoltageInvoice>(
      `${VOLTAGE_BASE_URL}/v1/invoice/${hexHash}`,
      {
        headers: {
          'Grpc-Metadata-macaroon': VOLTAGE_INVOICE_MACAROON
        }
      }
    );

    console.log('Voltage payment check response:', {
      status: response.status,
      data: response.data
    });

    return {
      paid: response.data.settled,
      amount: parseInt(response.data.amt_paid_sat || '0'),
      state: response.data.state
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Voltage API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error checking payment:', error);
    }
    throw new Error('Failed to check payment status');
  }
}

export async function payInvoice(paymentRequest: string): Promise<{ paymentHash: string; status: string }> {
  try {
    console.log('Paying invoice with Voltage:', {
      url: VOLTAGE_BASE_URL,
      payment_request: paymentRequest.substring(0, 20) + '...'
    });

    const response = await axios.post(
      `${VOLTAGE_BASE_URL}/v1/channels/transactions`,
      {
        payment_request: paymentRequest
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Grpc-Metadata-macaroon': VOLTAGE_INVOICE_MACAROON
        }
      }
    );

    console.log('Voltage payment response:', {
      payment_hash: response.data.payment_hash,
      status: response.data.status
    });

    return {
      paymentHash: response.data.payment_hash,
      status: response.data.status
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Voltage API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Error paying invoice:', error);
    }
    throw new Error('Failed to pay invoice');
  }
} 