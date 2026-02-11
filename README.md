# ts-przelewy24

![Build](https://github.com/tax1driver/ts-przelewy24/workflows/Build/badge.svg) ![](https://img.shields.io/github/license/tax1driver/ts-przelewy24) ![](https://img.shields.io/npm/v/@tax1driver/ts-przelewy24) ![](https://img.shields.io/github/last-commit/tax1driver/ts-przelewy24)

A type safe Przelewy24 client for TypeScript. Originally authored by [kasvith](https://github.com/kasvith), updated by me to extend API coverage.

This library provides an elegant way to create/verify transactions easily.

**Note: Now this library uses the new REST API available in [here](https://developers.przelewy24.pl/index.php?en).**

> Previous legacy API support is still available in **v1.1.1**
> Future versions will support new REST API only. If you use legacy API please use that version.

## Installation

```bash
npm install --save @tax1driver/ts-przelewy24
```

## Reference

[Full API & Types Reference](https://tax1driver.github.io/ts-przelewy24)

## Basic Usage

### Importing

```typescript
import {
  P24,
  Order,
  Currency,
  Country,
  Language,
  NotificationRequest,
  Verification
} from "@tax1driver/ts-przelewy24";
```

### Initialization

- **merchantId** : ID given by P24
- **posId** : Given by P24(often this referes to Merchant ID)
- **apiKey** : API Key from p24 panel(Klucz do raportów)
- **crcKey** : CRC value obtained from p24 panel

```typescript
const p24 = new P24(
  merchantId, 
  posId,
  apiKey,
  crcKey, 
  { 
    sandbox: false // enable or disable sandbox
  }
);
```

### Test access to P24

Test your connection to the Przelewy24 API.

```typescript
const result = await p24.testAccess();
console.log(result); // true on success or an error being thrown P24Error
```

### Create an order

Prepare the following details to initiate a payment:

```typescript
const order: Order = {
  sessionId: "c837e1a3-c5a3-4e89-adf1-05faffd8913b",
  amount: 1000, // Transaction amount expressed in lowest currency unit, e.g. 1.23 PLN = 123
  currency: Currency.PLN,
  description: "test order",
  email: "john.doe@example.com",
  country: Country.Poland,
  language: Language.PL,
  urlReturn: "http://myawesomeapp.com/continue",
  urlStatus: "http://myawesomeapp.com/p24callback", // callback to get notification
  timeLimit: 15, // 15min
  encoding: Encoding.UTF8,
}
const result = await p24.createTransaction(order)
console.log(result) // returns a valid URL to complete payment or throws an error
```

### Verify notification

The P24 system will send a notification to the `urlStatus` provided in the transaction order. You need to **verify** this notification request before verifying the transaction.

```typescript
const verify: NotificationRequest = req.body
const res = p24.verifyNotification(verify)
console.log(res) // true when the notification is valid
```

### Verify transaction

To accept the payment to your merchant account, after validating the notification request, you need to verify the transaction with the P24 system. **If you don't do this, the funds will not be transferred to your account**.

```typescript
// extract all information from callback request
const verifyRequest: Verification = {
    amount: 1000,
    currency: Currency.PLN,
    orderId: 3030,
    sessionId: 'c837e1a3-c5a3-4e89-adf1-05faffd8913b'
}

const res = await p24.verifyTransaction(verifyRequest)
console.log(res) // true on success, otherwise throws P24Error
```

### Refund an order

To refund a customer, you need to create a refund request.

```typescript
const ref = {
  refundsUuid: '94c1fb0b-f40f-4201-b2a0-f4166839d06c',
  requestId: 'afa379ac-c3ca-43d0-892f-e7a3f13ee4cc',
  refunds: [
    {
        amount: 1000,
        description: 'test',
        orderId: 3030,
        sessionId: 'c837e1a3-c5a3-4e89-adf1-05faffd8913b'
    }
  ],
}

const result = await p24.refund(ref)
console.log(result) // returns a SuccessResponse<RefundResult[]> with details about each refund request
```

### Get transaction details

Retrieve detailed information about a transaction by session ID.

```typescript
const details = await p24.getTransactionDetails('c837e1a3-c5a3-4e89-adf1-05faffd8913b')
console.log(details) // returns TransactionDetails object with all transaction information
```

### Get payment methods

Retrieve available payment methods for the merchant. Optionally filter by amount and currency.

```typescript
const methods = await p24.listPaymentMethods('en', { 
  amount: 1000, 
  currency: Currency.PLN 
})
console.log(methods) // returns array of PaymentMethod objects
```

### Get refunds by order ID

Retrieve all refunds for a specific order.

```typescript
const refunds = await p24.getRefundsByOrderId('3030')
console.log(refunds) // returns TransactionWithRefunds object containing transaction and refund details
```

### Register offline transaction

Register an offline transaction (e.g., bank transfer, cash).

```typescript
const offlineTransaction = await p24.registerOfflineTransaction(token)
console.log(offlineTransaction) // returns OfflineTransaction with bank account details
```

### Create split payment

Create a transaction with split payments to multiple recipients.

```typescript
const splitOrder = {
  ...order, // standard Order fields
  splits: [
    {
      amount: 500,
      description: 'Split 1',
      email: 'recipient1@example.com'
    },
    {
      amount: 500,
      description: 'Split 2',
      email: 'recipient2@example.com'
    }
  ]
}

const result = await p24.splitPayment(splitOrder)
console.log(result) // returns Transaction with token and link
```

## BLIK Payments

### Charge BLIK by code

Charge a customer's BLIK account using a 6-digit BLIK code.

```typescript
const blikParams = {
  token: 'transaction_token',
  blikCode: '123456',
  aliasValue: 'optional_alias', // optional: for future payments
  aliasLabel: 'My Phone', // optional: alias label
  recurring: { // optional: for recurring payments
    expiryDate: '2025-12-31',
    period: 'month'
  }
}

const result = await p24.chargeBlikByCode(blikParams)
console.log(result) // returns ChargeBlikData with orderId
```

### Charge BLIK by alias

Charge using a saved BLIK alias (for recurring payments).

```typescript
const blikParams = {
  token: 'transaction_token',
  aliasValue: 'saved_alias',
  aliasLabel: 'My Phone'
}

const result = await p24.chargeBlikByAlias(blikParams)
console.log(result) // returns ChargeBlikData with orderId
```

### Get BLIK aliases

Retrieve BLIK aliases for a customer by email.

```typescript
// Get standard BLIK aliases
const aliases = await p24.getBlikAliasesByEmail('customer@example.com')
console.log(aliases) // returns array of BlikAlias objects

// Get custom BLIK aliases (registered with aliasValue and aliasLabel)
const customAliases = await p24.getBlikAliasesByEmailCustom('customer@example.com')
console.log(customAliases) // returns array of BlikAlias objects
```

## Card Payments

### Charge card with 3D Secure

Initiate a card payment with 3D Secure authentication.

```typescript
const result = await p24.chargeCard3DS(token)
console.log(result) // returns { orderId, redirectUrl } for 3DS authentication
// Redirect customer to result.redirectUrl for authentication
```

### Charge card without 3D Secure

Charge a card directly without 3D Secure.

```typescript
const result = await p24.chargeCard(token)
console.log(result) // returns { orderId }
```

### Charge card direct

Charge a card directly with custom parameters.

```typescript
const params = {
  token: 'transaction_token',
  cardNumber: '4111111111111111',
  cvv: '123',
  expiryMonth: '12',
  expiryYear: '2025'
}

const result = await p24.chargeCardDirect(params)
console.log(result) // returns { orderId } or { orderId, redirectUrl } if 3DS is required
```

### Verify card payment notification

Verify card payment notifications sent by P24.

```typescript
const cardNotification: CardPaymentNotification = req.body
const isValid = p24.verifyCardNotification(cardNotification)
console.log(isValid) // true if notification is authentic
```

## Error Handling

The library throws `P24Error` when API calls fail. All errors include a message, error code, and details.

```typescript
import { P24Error } from "@tax1driver/ts-przelewy24";

try {
  const result = await p24.createTransaction(order)
  console.log(result)
} catch (error) {
  if (error instanceof P24Error) {
    console.error('P24 Error:', error.message)
    console.error('Error Code:', error.code)
    console.error('Details:', error.details)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### Validate IP addresses

Validate IP addresses against P24 backend servers.

```typescript
const valid = P24.isIpValid("127.0.0.1");
console.log(valid); // output false if IP is not from p24
```
