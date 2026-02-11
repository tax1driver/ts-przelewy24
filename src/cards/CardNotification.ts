/**
 * Card payment successful notification from Przelewy24
 *
 * @export
 * @interface CardPaymentSuccessfulNotification
 */
export interface CardPaymentSuccessfulNotification {
    /**
     * Payment amount
     *
     * @type {number}
     * @memberof CardPaymentSuccessfulNotification
     */
    amount: number;

    /**
     * Whether 3D Secure was used
     *
     * @type {boolean}
     * @memberof CardPaymentSuccessfulNotification
     */
    "3ds": boolean;

    /**
     * Payment method ID
     *
     * @type {number}
     * @memberof CardPaymentSuccessfulNotification
     */
    method: number;

    /**
     * Reference ID for the card
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    refId: string;

    /**
     * Order ID from Przelewy24
     *
     * @type {number}
     * @memberof CardPaymentSuccessfulNotification
     */
    orderId: number;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    sessionId: string;

    /**
     * Bank Identification Number (first 6 digits of card)
     *
     * @type {number}
     * @memberof CardPaymentSuccessfulNotification
     */
    bin: number;

    /**
     * Masked credit card number
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    maskedCCNumber: string;

    /**
     * Card expiration date
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    ccExp: string;

    /**
     * Hash of card data
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    hash: string;

    /**
     * Card issuing country
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    cardCountry: string;

    /**
     * Risk score
     *
     * @type {number}
     * @memberof CardPaymentSuccessfulNotification
     */
    risk: number;

    /**
     * Liability shift status (whether liability has shifted to the issuer or payment provider)
     *
     * @type {boolean}
     * @memberof CardPaymentSuccessfulNotification
     */
    liabilityshift: boolean;

    /**
     * Signature for verification
     *
     * @type {string}
     * @memberof CardPaymentSuccessfulNotification
     */
    sign: string;
}

/**
 * Card payment failed notification from Przelewy24
 *
 * @export
 * @interface CardPaymentFailedNotification
 */
export interface CardPaymentFailedNotification {
    /**
     * Payment amount
     *
     * @type {number}
     * @memberof CardPaymentFailedNotification
     */
    amount: number;

    /**
     * Whether 3D Secure was used
     *
     * @type {boolean}
     * @memberof CardPaymentFailedNotification
     */
    "3ds": boolean;

    /**
     * Payment method ID
     *
     * @type {number}
     * @memberof CardPaymentFailedNotification
     */
    method: number;

    /**
     * Order ID from Przelewy24
     *
     * @type {number}
     * @memberof CardPaymentFailedNotification
     */
    orderId: number;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     * @memberof CardPaymentFailedNotification
     */
    sessionId: string;

    /**
     * Error code
     *
     * @type {string}
     * @memberof CardPaymentFailedNotification
     */
    errorCode: string;

    /**
     * Error message
     *
     * @type {string}
     * @memberof CardPaymentFailedNotification
     */
    errorMessage: string;

    /**
     * Signature for verification
     *
     * @type {string}
     * @memberof CardPaymentFailedNotification
     */
    sign: string;
}

/**
 * Union type for card payment notifications (success or failure)
 *
 * @export
 * @type {CardPaymentNotification}
 */
export type CardPaymentNotification = CardPaymentSuccessfulNotification | CardPaymentFailedNotification;