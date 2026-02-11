# Przelewy24 for NodeJS

![Build](https://github.com/ingameltd/node-przelewy24/workflows/Build/badge.svg) ![](https://img.shields.io/github/license/ingameltd/node-przelewy24) ![](https://img.shields.io/npm/v/@ingameltd/node-przelewy24) ![](https://img.shields.io/github/last-commit/ingameltd/node-przelewy24)

NodeJS Library for [**Przelewy24**](https://przelewy24.pl/). This library is written in Typescript to provide
best typesafety.

This library provides an elegant way to create/verify transactions easily.

**Note: Now this library uses the new REST API availiable in [here](https://developers.przelewy24.pl/index.php?en).**

> Previous legacy API support is still availiable in **v1.1.1**
> Future versions will support new REST API only, If you use legacy API please use that version

## Documentation

Documentation can be in read [here](https://ingameltd.github.io/node-przelewy24).

## Installation

```bash
npm install --save @ingameltd/node-przelewy24
```

## Typescript

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
} from "@ingameltd/node-przelewy24";
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

### Testing access to P24

```typescript
const result = await p24.testAccess();
console.log(result); // true on success or an error being throw P24Error
```

### Get payment link

Prepare following details to initiate a payment

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
console.log(result) // prints a valid url to pay the payment or throws an error
```

### Verify Notification

P24 system will send you a notification to the `urlStatus` provided in
transaction order. You need to **verify** this Notification request before actually **Verify Transaction**

```typescript
const verify: NotificationRequest = req.body
const res = p24.verifyNotification(verify)
console.log(res) // true when the Notification is valid
```

### Verifies a transaction with P24

To accept the payment to your merchant account, after validating the Notification
request, you need to verify the transaction with P24 system. **If you don't do that the funds will not be transferred into your account**.

```typescript
// extract all information from callback request
const verifyRequest: Verification = {
    amount: 1000,
    currency: Currency.PLN,
    orderId: 3030,
    sessionId: 'c837e1a3-c5a3-4e89-adf1-05faffd8913b'
}

const res = await p24.verifyTransaction(verifyRequest)
console.log(res) // true on success otherwise P24Error
```

### Refund a requst

To refund the customer you need to open up a refund request

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
console.log(result) // returns a SuccessResponse<RefundResult[]> where you can find about each refund request in array
```

### Get Transaction Details

Retrieve detailed information about a transaction by session ID

```typescript
const details = await p24.getTransactionDetails('c837e1a3-c5a3-4e89-adf1-05faffd8913b')
console.log(details) // returns TransactionDetails object with all transaction information
```

### List Payment Methods

Get available payment methods for the merchant, optionally filtered by amount and currency

```typescript
const methods = await p24.listPaymentMethods('en', { 
  amount: 1000, 
  currency: Currency.PLN 
})
console.log(methods) // returns array of PaymentMethod objects
```

### Get Refunds by Order ID

Retrieve all refunds for a specific order

```typescript
const refunds = await p24.getRefundsByOrderId('3030')
console.log(refunds) // returns TransactionWithRefunds object containing transaction and refund details
```

### Offline Transaction

Register an offline transaction (e.g., bank transfer, cash)

```typescript
const offlineTransaction = await p24.registerOfflineTransaction(token)
console.log(offlineTransaction) // returns OfflineTransaction with bank account details
```

### Split Payment

Create a transaction with split payments to multiple recipients

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

### Charge BLIK by Code

Charge customer's BLIK account using a 6-digit BLIK code

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

### Charge BLIK by Alias

Charge using a saved BLIK alias (for recurring payments)

```typescript
const blikParams = {
  token: 'transaction_token',
  aliasValue: 'saved_alias',
  aliasLabel: 'My Phone'
}

const result = await p24.chargeBlikByAlias(blikParams)
console.log(result) // returns ChargeBlikData with orderId
```

### Get BLIK Aliases

Retrieve BLIK aliases for a customer by email

```typescript
// Get standard BLIK aliases
const aliases = await p24.getBlikAliasesByEmail('customer@example.com')
console.log(aliases) // returns array of BlikAlias objects

// Get custom BLIK aliases (registered with aliasValue and aliasLabel)
const customAliases = await p24.getBlikAliasesByEmailCustom('customer@example.com')
console.log(customAliases) // returns array of BlikAlias objects
```

## Card Payments

### Charge Card with 3D Secure

Initiate a card payment with 3D Secure authentication

```typescript
const result = await p24.chargeCard3DS(token)
console.log(result) // returns { orderId, redirectUrl } for 3DS authentication
// Redirect customer to result.redirectUrl for authentication
```

### Charge Card without 3D Secure

Charge a card directly without 3D Secure

```typescript
const result = await p24.chargeCard(token)
console.log(result) // returns { orderId }
```

### Charge Card Direct

Charge a card directly with custom parameters

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

### Verify Card Payment Notification

Verify card payment notifications sent by P24

```typescript
const cardNotification: CardPaymentNotification = req.body
const isValid = p24.verifyCardNotification(cardNotification)
console.log(isValid) // true if notification is authentic
```

## Error Handling

The library throws `P24Error` when API calls fail. All errors include a message and error code.

```typescript
import { P24Error } from "@ingameltd/node-przelewy24";

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

### Validate IP

Library provides method to validate IP addresses with P24 backends

```typescript
const valid = P24.isIpValid("127.0.0.1");
console.log(valid); // output false if IP is not from p24
```
