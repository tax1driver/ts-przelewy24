/**
 * BLIK recurring payment parameters
 *
 * @export
 * @interface RecurringParams
 */
export interface RecurringParams {
    /**
     * Type of recurring payment (O - one-time, M - monthly, A - annual)
     *
     * @type {('O' | 'M' | 'A')}
     * @memberof RecurringParams
     */
    type: 'O' | 'M' | 'A';

    /**
     * Expiration date of the recurring payment
     *
     * @type {string}
     * @memberof RecurringParams
     */
    expirationDate: string;

    /**
     * Check if the bank supports recurring payments
     *
     * @type {boolean}
     * @memberof RecurringParams
     */
    availableBanks: boolean;

    /**
     * Initialization date of the recurring payment
     *
     * @type {string}
     * @memberof RecurringParams
     */
    initDate: string;
}
