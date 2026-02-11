import { Order } from "./Order";

/**
 * Split payment details for VAT transfer
 *
 * @export
 * @interface SplitPaymentDetails
 */
export interface SplitPaymentDetails {
    /**
     * VAT amount to be transferred
     *
     * @type {number}
     * @memberof SplitPaymentDetails
     */
    vatAmount: number;

    /**
     * Invoice number
     *
     * @type {string}
     * @memberof SplitPaymentDetails
     */
    invoiceNumber: string;

    /**
     * Tax identification number (NIP)
     *
     * @type {string}
     * @memberof SplitPaymentDetails
     */
    nip: string;

    /**
     * Optional IBAN account number
     *
     * @type {string}
     * @memberof SplitPaymentDetails
     */
    iban?: string;
}

/**
 * Order with split payment details
 *
 * @export
 * @interface SplitPaymentOrder
 * @extends {Order}
 */
export interface SplitPaymentOrder extends Order {
    /**
     * Split payment details
     *
     * @type {SplitPaymentDetails}
     * @memberof SplitPaymentOrder
     */
    splitPaymentDetails: SplitPaymentDetails;
}