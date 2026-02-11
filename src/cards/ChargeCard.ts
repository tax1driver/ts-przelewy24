/**
 * Parameters for card charge with 3D Secure authentication
 *
 * @export
 * @interface ChargeCard3DSParams
 */
export interface ChargeCard3DSParams {
    /**
     * Order ID from Przelewy24
     *
     * @type {string}
     * @memberof ChargeCard3DSParams
     */
    orderId: string;

    /**
     * URL to redirect for 3DS authentication
     *
     * @type {string}
     * @memberof ChargeCard3DSParams
     */
    redirectUrl: string;
}

/**
 * Parameters for card charge without 3D Secure
 *
 * @export
 * @interface ChargeCardParams
 */
export interface ChargeCardParams {
    /**
     * Order ID from Przelewy24
     *
     * @type {string}
     * @memberof ChargeCardParams
     */
    orderId: string;
}

/**
 * Parameters for direct card charge
 *
 * @export
 * @interface ChargeCardDirectParams
 */
export interface ChargeCardDirectParams {
    /**
     * Transaction token
     *
     * @type {string}
     * @memberof ChargeCardDirectParams
     */
    transactionToken: string;

    /**
     * Card number
     *
     * @type {string}
     * @memberof ChargeCardDirectParams
     */
    cardNumber: string;

    /**
     * Card expiration date
     *
     * @type {string}
     * @memberof ChargeCardDirectParams
     */
    cardDate: string;

    /**
     * Card CVV/CVC code
     *
     * @type {string}
     * @memberof ChargeCardDirectParams
     */
    cvv: string;

    /**
     * Cardholder name
     *
     * @type {string}
     * @memberof ChargeCardDirectParams
     */
    clientName: string;
}