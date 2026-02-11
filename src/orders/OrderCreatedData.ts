/**
 * Data returned after order creation
 *
 * @export
 * @interface OrderCreatedData
 */
export interface OrderCreatedData {
    /**
     * Token to do a payment redirect
     *
     * @type {string}
     * @memberof OrderCreatedData
     */
    token: string;
}
