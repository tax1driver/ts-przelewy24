/**
 * BLIK alias status
 *
 * @export
 * @type {BlikAliasStatus}
 */
export type BlikAliasStatus = 'REGISTERED' | 'UNREGISTERED' | 'EXPIRED';

/**
 * BLIK alias update notification
 *
 * @export
 * @interface AliasUpdateNotification
 */
export interface AliasUpdateNotification {
    /**
     * Alias value
     *
     * @type {string}
     * @memberof AliasUpdateNotification
     */
    value: string;

    /**
     * Customer email address
     *
     * @type {string}
     * @memberof AliasUpdateNotification
     */
    email: string;

    /**
     * Alias type
     *
     * @type {string}
     * @memberof AliasUpdateNotification
     */
    type: string;

    /**
     * Alias status
     *
     * @type {BlikAliasStatus}
     * @memberof AliasUpdateNotification
     */
    status: BlikAliasStatus;
}

/**
 * BLIK alias information
 *
 * @export
 * @interface BlikAlias
 */
export interface BlikAlias {
    /**
     * Alias value
     *
     * @type {string}
     * @memberof BlikAlias
     */
    value: string;

    /**
     * Alias type
     *
     * @type {string}
     * @memberof BlikAlias
     */
    type: string;

    /**
     * Alias status
     *
     * @type {string}
     * @memberof BlikAlias
     */
    status: string;

    /**
     * Alias expiration date
     *
     * @type {string}
     * @memberof BlikAlias
     */
    expirationDate: string;
}