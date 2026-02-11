/**
 * Transaction details
 *
 * @export
 * @interface TransactionDetails
 */
export interface TransactionDetails {
    /**
     * Transaction statement
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    statement: string;

    /**
     * Order ID from Przelewy24
     *
     * @type {number}
     * @memberof TransactionDetails
     */
    orderId: number;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    sessionId: string;

    /**
     * Transaction status code
     *
     * @type {number}
     * @memberof TransactionDetails
     */
    status: number;

    /**
     * Transaction amount
     *
     * @type {number}
     * @memberof TransactionDetails
     */
    amount: number;

    /**
     * Transaction currency
     *
     * @type {"PLN"}
     * @memberof TransactionDetails
     */
    currency: "PLN";

    /**
     * Transaction creation date
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    date: string;

    /**
     * Date when transaction was completed
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    dateOfTransaction: string;

    /**
     * Client email address
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    clientEmail: string;

    /**
     * MD5 hash of account data
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    accountMD5: string;

    /**
     * Payment method ID used
     *
     * @type {number}
     * @memberof TransactionDetails
     */
    paymentMethod: number;

    /**
     * Transaction description
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    description: string;

    /**
     * Client name
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    clientName: string;

    /**
     * Client address
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    clientAddress: string;

    /**
     * Client city
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    clientCity: string;

    /**
     * Client postal code
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    clientPostcode: string;

    /**
     * Batch ID
     *
     * @type {number}
     * @memberof TransactionDetails
     */
    batchId: number;

    /**
     * Transaction fee
     *
     * @type {string}
     * @memberof TransactionDetails
     */
    fee: string;
}