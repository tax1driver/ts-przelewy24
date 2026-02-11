/**
 * Offline transaction details for bank transfer
 *
 * @export
 * @type {OfflineTransaction}
 */
export type OfflineTransaction = {
    /**
     * Order ID from Przelewy24
     *
     * @type {number}
     */
    orderId: number;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     */
    sessionId: string;

    /**
     * Transaction amount
     *
     * @type {number}
     */
    amount: number;

    /**
     * Statement/description for bank transfer
     *
     * @type {string}
     */
    statement: string;

    /**
     * IBAN account number for transfer
     *
     * @type {string}
     */
    iban: string;

    /**
     * IBAN account owner name
     *
     * @type {string}
     */
    ibanOwner: string;

    /**
     * IBAN account owner address
     *
     * @type {string}
     */
    ibanOwnerAddress: string;
};