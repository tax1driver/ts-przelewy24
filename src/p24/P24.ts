/**
 * MIT License
 *
 * Copyright (c) 2019 Kasun Vithanage
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import Axios, { AxiosInstance } from 'axios';
import { P24Error } from '../errors';
import { P24Options } from './P24Options';
import { validIps } from './ips';
import {
    SuccessResponse,
    ErrorResponse
} from '../responses';
import { BaseParameters } from './BaseParameters';
import { calculateSHA384 } from '../utils/hash';
import {
    Order,
    OrderCreatedData,
    Transaction
} from '../orders';
import {
    ProductionUrl,
    SandboxUrl,
    EndpointTestAccess,
    EndpointTransactionRegister,
    EndpointTransactionRequest,
    EndpointTransactionVerify,
    EndpointRefund,
    EndpointDetails,
    EndpointPaymentMethods,
    EndpointOfflineTransaction,
    EndpointSplitPayment,
    EndpointRefundsByOrderId
} from './endpoints';
import {
    Verification,
    NotificationRequest,
    VerificationData
} from '../verify';
import {
    RefundRequest,
    RefundResult
} from '../refund';
import { TransactionDetails } from '../orders/TransactionDetails';
import { Currency } from '../enums';
import { PaymentMethod } from '../payment/PaymentMethod';
import { OfflineTransaction } from '../orders/OfflineTransaction';
import { SplitPaymentOrder } from '../orders/SplitPayment';
import { TransactionWithRefunds } from '../refund/TransactionWithRefunds';
import { ChargeCard3DSParams, ChargeCardParams, ChargeCardDirectParams } from '../cards/ChargeCard';
import { CardPaymentNotification } from '../cards/CardNotification';
import { BlikAlias } from '../blik/Alias';
import { ChargeBlikByAliasParams, ChargeBlikByCodeParams, ChargeBlikData } from '../blik/ChargeBlik';



/**
 * Represents a P24 payment system
 *
 * @export
 * @class P24
 */
export class P24 {
    private merchantId: number;
    private posId: number;
    private crcKey: string;
    private apiKey: string;
    private client: AxiosInstance;
    private baseUrl: string;
    private options: P24Options;
    private baseParameters: BaseParameters;

    /**
    * Creates an instance of Przelewy24.
    * @param {number} merchantId Merchant ID given by Przelewy24
    * @param {number} posId Shop ID (defaults to merchantId)
    * @param {string} apiKey API Key from P24 panel(Klucz do raportów)
    * @param {string} crcKey CRC key from P24 panel
    * @param {P24Options} [options={ sandbox: false }] - additional options
    * @memberof P24
    */
    constructor(
        merchantId: number,
        posId: number,
        apiKey: string,
        crcKey: string,
        options: P24Options = { sandbox: false }
    ) {
        this.merchantId = merchantId;
        this.posId = posId;
        this.crcKey = crcKey;
        this.apiKey = apiKey;
        this.options = options
        if (!this.posId)
            this.posId = this.merchantId;

        this.baseUrl = !this.options.sandbox ? ProductionUrl : SandboxUrl;

        this.baseParameters = {
            merchantId: this.merchantId,
            posId: this.posId
        };

        this.client = Axios.create({
            baseURL: `${this.baseUrl}/api/v1`,
            auth: {
                username: posId.toString(),
                password: this.apiKey
            }
        });
    }

    /**
     * Centralized error handler for API calls
     * @private
     * @param {any} error - The caught error
     * @param {string} defaultMessage - Default error message
     * @throws {P24Error}
     */
    private handleApiError(error: any, defaultMessage: string = 'Request failed'): never {
        if (error.response?.data) {
            const resp = error.response.data as ErrorResponse<any>;
            throw new P24Error(resp.error || defaultMessage, resp.code || -1);
        }
        throw new P24Error(defaultMessage, -1, error.message || String(error));
    }

    /**
     * Test access to the service
     *
     * @returns {Promise<boolean>}
     * @throws {P24Error}
     * @memberof P24
     */
    public async testAccess(): Promise<boolean> {
        try {
            const { data } = await this.client.get(EndpointTestAccess)
            const res = <SuccessResponse<boolean>>data
            return res.data === true
        } catch (error: any) {
            this.handleApiError(error, 'Test access failed');
        }
    }

    /**
     * Creates a transaction
     *
     * @param {Order} order - order to be created
     * @returns {Promise<Transaction>}
     * @throws {P24Error}
     * @memberof P24
     */
    public async createTransaction(order: Order): Promise<Transaction> {
        try {
            const hashData = {
                sessionId: order.sessionId,
                merchantId: this.merchantId,
                amount: order.amount,
                currency: order.currency,
                crc: this.crcKey
            }

            const sign = calculateSHA384(JSON.stringify(hashData))

            const orderData = {
                ...this.baseParameters,
                ...order,
                sign,
            }

            const { data } = await this.client.post(EndpointTransactionRegister, orderData)
            const response = <SuccessResponse<OrderCreatedData>>data
            const transaction: Transaction = {
                token: response.data.token,
                link: `${this.baseUrl}${EndpointTransactionRequest}/${response.data.token}`
            }

            return transaction
        } catch (error: any) {
            this.handleApiError(error, 'Transaction creation failed');
        }
    }


    /**
     * Verify transaction
     *
     * @param {Verification} verification - verification request
     * @returns {Promise<boolean>}
     * @throws {P24Error}
     * @memberof P24
     */
    public async verifyTransaction(verification: Verification): Promise<boolean> {
        try {
            const hashData = {
                sessionId: verification.sessionId,
                orderId: verification.orderId,
                amount: verification.amount,
                currency: verification.currency,
                crc: this.crcKey
            }

            const sign = calculateSHA384(JSON.stringify(hashData))

            const verificationData = {
                ...this.baseParameters,
                ...verification,
                sign
            }

            const { data } = await this.client.put(EndpointTransactionVerify, verificationData)
            const result = <SuccessResponse<VerificationData>>data
            return result.data.status === 'success'
        } catch (error: any) {
            this.handleApiError(error, 'Transaction verification failed');
        }
    }

    /**
     * Verify notification transaction with our CRC Key
     *
     * @param {NotificationRequest} notificationRequest
     * @returns {boolean}
     * @memberof P24
     */
    public verifyNotification(notificationRequest: NotificationRequest): boolean {
        const notificationHash = {
            ...notificationRequest,
            sign: undefined,
            crc: this.crcKey
        }
        const sign = calculateSHA384(JSON.stringify(notificationHash))
        return sign === notificationRequest.sign
    }

    /**
     * Handle refund
     *
     * @param {RefundRequest} refundRequest
     * @returns {Promise<RefundResult[]>}
     * @memberof P24
     */
    public async refund(refundRequest: RefundRequest): Promise<RefundResult[]> {
        try {
            const { data } = await this.client.post(EndpointRefund, refundRequest)
            const resp = <SuccessResponse<RefundResult[]>>data
            return resp.data
        } catch (error: any) {
            this.handleApiError(error, 'Refund failed');
        }
    }

    /**
     * Get transaction details
     *
     * @param {string} sessionId
     * @returns {Promise<TransactionDetails>}
     * @memberof P24
     */
    public async getTransactionDetails(sessionId: string): Promise<TransactionDetails> {
        try {
            const { data } = await this.client.get(EndpointDetails + `/${sessionId}`);

            const resp = <SuccessResponse<TransactionDetails>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to get transaction details');
        }
    }


    /**
     * List payment methods
     * 
     * @param {string} lang - Language code ('en' or 'pl')
     * @returns {PaymentMethod[]} - List of payment methods
     * @memberof P24
     */
    public async listPaymentMethods(lang: string, options?: { amount?: number, currency?: Currency }): Promise<PaymentMethod[]> {
        try {
            const params = new URLSearchParams();
            if (options?.currency) params.append('currency', options.currency);
            if (options?.amount) params.append('amount', options.amount.toString());
            const query = params.toString();

            const { data } = await this.client.get(EndpointPaymentMethods + `/${lang}?${query}`);

            const resp = <SuccessResponse<PaymentMethod[]>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to list payment methods');
        }
    }

    /**
     * Register offline transaction
     * 
     * @param {string} token - Transaction token obtained with createTransaction
     * @returns {Promise<OfflineTransaction>} - Offline transaction details
     * @throws {P24Error}
     * @memberof P24
     */
    public async registerOfflineTransaction(token: string): Promise<OfflineTransaction> {
        try {
            const { data } = await this.client.post(EndpointOfflineTransaction, {
                token
            });

            const resp = <SuccessResponse<OfflineTransaction>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to register offline transaction');
        }
    }

    /**
     * Split payment
     * 
     * @param {SplitPaymentOrder} order - order with split payment details
     * @returns {Promise<Transaction>}
     * @throws {P24Error}
     * @memberof P24
     */
    public async splitPayment(order: SplitPaymentOrder): Promise<Transaction> {
        try {
            const { data } = await this.client.post(EndpointSplitPayment, {
                ...this.baseParameters,
                ...order,
            });
            const resp = <SuccessResponse<Transaction>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Split payment failed');
        }
    }

    /**
     * Get refund by orderID
     * 
     * @param {string} orderId - Order ID
     * @returns {Promise<TransactionWithRefunds>} - List of refunds
     * @throws {P24Error}
     * @memberof P24
     */
    public async getRefundsByOrderId(orderId: string): Promise<TransactionWithRefunds> {
        try {
            const { data } = await this.client.get(EndpointRefundsByOrderId + `/${orderId}`);

            const resp = <SuccessResponse<TransactionWithRefunds>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to get refunds by order ID');
        }
    }

    /**
     * Charge card with 3DS
     * 
     * @param {string} token - Card token
     * @returns {Promise<ChargeCard3DSParams>} - 3DS Data
     * @throws {P24Error}
     * @memberof P24
     */
    public async chargeCard3DS(token: string): Promise<ChargeCard3DSParams> {
        try {
            const { data } = await this.client.post('/card/chargeWith3ds', {
                token
            });

            const resp = <SuccessResponse<ChargeCard3DSParams>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Card charge with 3DS failed');
        }
    }

    /**
     * Charge card without 3DS
     * 
     * @param {string} token - Card token
     * @returns {Promise<ChargeCardParams>} - Charge card data
     * @throws {P24Error}
     * @memberof P24
     */
    public async chargeCard(token: string): Promise<ChargeCardParams> {
        try {
            const { data } = await this.client.post('/card/charge', {
                token
            });

            const resp = <SuccessResponse<ChargeCardParams>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Card charge failed');
        }
    }

    /**
     * Charge card directly
     * 
     * @param {ChargeCardDirectParams} params - Direct charge parameters
     * @returns {Promise<ChargeCardParams>} - Charge card data
     * @throws {P24Error}
     * @memberof P24
     */
    public async chargeCardDirect(params: ChargeCardDirectParams): Promise<ChargeCardParams | ChargeCard3DSParams> {
        try {
            const { data } = await this.client.post('/card/chargeDirect', {
                ...params
            });

            const resp = <SuccessResponse<ChargeCardParams>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Direct card charge failed');
        }
    }

    /**
     * Verifies card payment notification
     * 
     * @param {CardNotificationRequest} cardNotificationRequest - Card notification request
     * @returns {boolean} - true on valid notification
     * @memberof P24
     */
    public verifyCardNotification(cardNotificationRequest: CardPaymentNotification): boolean {
        const notificationHash = {
            ...cardNotificationRequest,
            sign: undefined,
            crc: this.crcKey
        }

        const sign = calculateSHA384(JSON.stringify(notificationHash))
        return sign === cardNotificationRequest.sign
    }

    /**
     * Charge BLIK account by code
     * 
     * @param {ChargeBlikByCodeParams} params - BLIK charge parameters
     * @returns {Promise<ChargeBlikData>} - BLIK charge data
     * @throws {P24Error}
     * @memberof P24
     */
    public async chargeBlikByCode(params: ChargeBlikByCodeParams): Promise<ChargeBlikData> {
        try {
            const { data } = await this.client.post('/paymentMethod/blik/chargeByCode', params);

            const resp = <SuccessResponse<ChargeBlikData>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'BLIK charge by code failed');
        }
    }

    /**
     * Charge BLIK account by alias
     * 
     * @param {ChargeBlikByAliasParams} params - BLIK charge parameters
     * @returns {Promise<ChargeBlikData>} - BLIK charge data
     * @throws {P24Error}
     * @memberof P24
     */
    public async chargeBlikByAlias(params: ChargeBlikByAliasParams): Promise<ChargeBlikData> {
        try {
            const { data } = await this.client.post('/paymentMethod/blik/chargeByAlias', params);
            const resp = <SuccessResponse<ChargeBlikData>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'BLIK charge by alias failed');
        }
    }

    /**
     * Get BLIK aliases by email
     * 
     * @param {string} email - Customer email
     * @returns {Promise<BlikAlias[]>} - List of BLIK aliases
     * @throws {P24Error}
     * @memberof P24
     */
    public async getBlikAliasesByEmail(email: string): Promise<BlikAlias[]> {
        try {
            const { data } = await this.client.get(`/paymentMethod/blik/aliases/${email}`);
            const resp = <SuccessResponse<BlikAlias[]>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to get BLIK aliases by email');
        }
    }

    /**
     * Get BLIK aliases by email (for aliases registered with aliasValue and aliasLabel fields)
     * 
     * @param {string} email - Customer email
     * @returns {Promise<BlikAlias[]>} - List of BLIK aliases
     * @throws {P24Error}
     * @memberof P24
     */
    public async getBlikAliasesByEmailCustom(email: string): Promise<BlikAlias[]> {
        try {
            const { data } = await this.client.get(`/paymentMethod/blik/aliases/custom/${email}`);
            const resp = <SuccessResponse<BlikAlias[]>>data;
            return resp.data;
        } catch (error: any) {
            this.handleApiError(error, 'Failed to get custom BLIK aliases by email');
        }
    }

    /**
     * Validates IP with P24 backends
     *
     * @static
     * @param {string} ip - IP Address
     * @returns {boolean} - true on validated ip 
     * @memberof Przelewy24
     */
    public static isIpValid(ip: string): boolean {
        return validIps.find(validIp => validIp === ip) !== undefined;
    }

}