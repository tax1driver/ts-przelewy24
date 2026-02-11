/**
 * Payment method information
 *
 * @export
 * @interface PaymentMethod
 */
export interface PaymentMethod {
    /**
     * Payment method name
     *
     * @type {string}
     * @memberof PaymentMethod
     */
    name: string;

    /**
     * Payment method ID
     *
     * @type {number}
     * @memberof PaymentMethod
     */
    id: number;

    /**
     * Payment method group
     *
     * @type {string}
     * @memberof PaymentMethod
     */
    group: string;

    /**
     * Payment method subgroup
     *
     * @type {string}
     * @memberof PaymentMethod
     */
    subgroup: string;

    /**
     * Whether payment method is active
     *
     * @type {boolean}
     * @memberof PaymentMethod
     */
    status: boolean;

    /**
     * Image URL for desktop
     *
     * @type {string}
     * @memberof PaymentMethod
     */
    imgUrl: string;

    /**
     * Image URL for mobile
     *
     * @type {string}
     * @memberof PaymentMethod
     */
    mobileImgUrl: string;

    /**
     * Whether payment method is available on mobile
     *
     * @type {boolean}
     * @memberof PaymentMethod
     */
    mobile: boolean;

    /**
     * Availability hours for the payment method
     *
     * @type {{ mondayToFriday: string; saturday: string; sunday: string }}
     * @memberof PaymentMethod
     */
    availabilityHours: {
        mondayToFriday: string;
        saturday: string;
        sunday: string;
    };
}