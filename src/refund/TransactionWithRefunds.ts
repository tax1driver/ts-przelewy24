/**
 * Individual refund in a collection
 *
 * @export
 * @interface RefundsCollection
 */
export interface RefundsCollection {
    /**
     * Batch ID for the refund
     *
     * @type {number}
     * @memberof RefundsCollection
     */
    batchId: number;

    /**
     * Refund request ID
     *
     * @type {string}
     * @memberof RefundsCollection
     */
    requestId: string;

    /**
     * Refund date
     *
     * @type {string}
     * @memberof RefundsCollection
     */
    date: string;

    /**
     * Login of user who initiated the refund
     *
     * @type {string}
     * @memberof RefundsCollection
     */
    login: string;

    /**
     * Refund description
     *
     * @type {string}
     * @memberof RefundsCollection
     */
    description: string;

    /**
     * Refund status code
     *
     * @type {number}
     * @memberof RefundsCollection
     */
    status: number;

    /**
     * Refunded amount
     *
     * @type {number}
     * @memberof RefundsCollection
     */
    amount: number;
}

/**
 * Transaction with all associated refunds
 *
 * @export
 * @interface TransactionWithRefunds
 */
export interface TransactionWithRefunds {
    /**
     * Order ID from Przelewy24
     *
     * @type {number}
     * @memberof TransactionWithRefunds
     */
    orderId: number;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     * @memberof TransactionWithRefunds
     */
    sessionId: string;

    /**
     * Original transaction amount
     *
     * @type {number}
     * @memberof TransactionWithRefunds
     */
    amount: number;

    /**
     * Transaction currency
     *
     * @type {string}
     * @memberof TransactionWithRefunds
     */
    currency: string;

    /**
     * Array of refunds associated with this transaction
     *
     * @type {Array<RefundsCollection>}
     * @memberof TransactionWithRefunds
     */
    refunds: Array<RefundsCollection>;
}