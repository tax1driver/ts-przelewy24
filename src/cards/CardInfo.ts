/**
 * Credit card information
 *
 * @export
 * @type {CardInfo}
 */
export type CardInfo = {
    /**
     * Reference ID for the card
     *
     * @type {string}
     */
    refId: string;

    /**
     * Bank Identification Number (first 6 digits of card)
     *
     * @type {number}
     */
    bin: number;

    /**
     * Masked card number
     *
     * @type {string}
     */
    mask: string;

    /**
     * Card type (e.g., Visa, Mastercard)
     *
     * @type {string}
     */
    cardType: string;

    /**
     * Card expiration date
     *
     * @type {string}
     */
    cardDate: string;

    /**
     * Hash of card data
     *
     * @type {string}
     */
    hash: string;
};