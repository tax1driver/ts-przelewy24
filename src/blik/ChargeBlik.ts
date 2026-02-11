import { RecurringParams } from './RecurringParams';

/**
 * Parameters for charging BLIK account by code
 *
 * @export
 * @interface ChargeBlikByCodeParams
 */
export interface ChargeBlikByCodeParams {
    /**
     * Transaction token
     *
     * @type {string}
     * @memberof ChargeBlikByCodeParams
     */
    token: string;

    /**
     * BLIK code from the customer
     *
     * @type {string}
     * @memberof ChargeBlikByCodeParams
     */
    blikCode: string;

    /**
     * Optional alias value for future payments
     *
     * @type {string}
     * @memberof ChargeBlikByCodeParams
     */
    aliasValue?: string;

    /**
     * Optional alias label for identification
     *
     * @type {string}
     * @memberof ChargeBlikByCodeParams
     */
    aliasLabel?: string;

    /**
     * Optional recurring payment parameters
     *
     * @type {RecurringParams}
     * @memberof ChargeBlikByCodeParams
     */
    recurring?: RecurringParams;
}

/**
 * Parameters for charging BLIK account by alias
 *
 * @export
 * @interface ChargeBlikByAliasParams
 */
export interface ChargeBlikByAliasParams {
    /**
     * Transaction token
     *
     * @type {string}
     * @memberof ChargeBlikByAliasParams
     */
    token: string;

    /**
     * Payment type (must be 'alias')
     *
     * @type {'alias'}
     * @memberof ChargeBlikByAliasParams
     */
    type: 'alias';

    /**
     * BLIK alias value
     *
     * @type {string}
     * @memberof ChargeBlikByAliasParams
     */
    aliasValue: string;

    /**
     * Optional alias label for identification
     *
     * @type {string}
     * @memberof ChargeBlikByAliasParams
     */
    aliasLabel?: string;

    /**
     * Optional recurring payment parameters
     *
     * @type {RecurringParams}
     * @memberof ChargeBlikByAliasParams
     */
    recurring?: RecurringParams;
}

/**
 * BLIK charge response data
 *
 * @export
 * @interface ChargeBlikData
 */
export interface ChargeBlikData {
    /**
     * Order ID from Przelewy24
     *
     * @type {string}
     * @memberof ChargeBlikData
     */
    orderId: string;

    /**
     * Response message
     *
     * @type {string}
     * @memberof ChargeBlikData
     */
    message: string
}

/**
 * BLIK payment notification from Przelewy24
 *
 * @export
 * @interface BlikPaymentNotification
 */
export interface BlikPaymentNotification {
    /**
     * Order ID from Przelewy24
     *
     * @type {string}
     * @memberof BlikPaymentNotification
     */
    orderId: string;

    /**
     * Transaction session ID from the Partner's system
     *
     * @type {string}
     * @memberof BlikPaymentNotification
     */
    sessionId: string;

    /**
     * Payment method ID
     *
     * @type {number}
     * @memberof BlikPaymentNotification
     */
    method: number;

    /**
     * Payment result details
     *
     * @type {{ error: string; message: string; status: string; trxRef: string }}
     * @memberof BlikPaymentNotification
     */
    result: {
        error: string;
        message: string;
        status: string;
        trxRef: string
    }
};