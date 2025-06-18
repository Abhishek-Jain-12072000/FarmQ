const EVENT_HANDLER_KEY_MAP = {
    updateBlur: 'handleBlur',
    updateForm: 'handleChange',
    submitForm: 'handleSubmit',
};
const COMMON_ROUTE_MACHINE_KEYS = [
    'error',
    'isPending',
    'submitForm',
    'updateBlur',
    'updateForm',
];
const CONFIRM_RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'resendCode',
    'validationErrors',
];
const CONFIRM_SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
    'user',
];
const CONFIRM_SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'codeDeliveryDetails',
    'resendCode',
];
const CONFIRM_VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const FORCE_NEW_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'toSignIn',
    'validationErrors',
];
const RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
];
const SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toFederatedSignIn',
    'toResetPassword',
    'toSignUp',
];
const SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'toSignIn',
    'validationErrors',
];
const SETUP_TOTP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
    'totpSecretCode',
];
const VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const MACHINE_PROP_KEYS = {
    confirmResetPassword: CONFIRM_RESET_PASSWORD_MACHINE_KEYS,
    confirmSignIn: CONFIRM_SIGN_IN_MACHINE_KEYS,
    confirmSignUp: CONFIRM_SIGN_UP_MACHINE_KEYS,
    confirmVerifyUser: CONFIRM_VERIFY_USER_MACHINE_KEYS,
    forceNewPassword: FORCE_NEW_PASSWORD_MACHINE_KEYS,
    signIn: SIGN_IN_MACHINE_KEYS,
    signUp: SIGN_UP_MACHINE_KEYS,
    resetPassword: RESET_PASSWORD_MACHINE_KEYS,
    setupTOTP: SETUP_TOTP_MACHINE_KEYS,
    verifyUser: VERIFY_USER_MACHINE_KEYS,
};

export { EVENT_HANDLER_KEY_MAP, MACHINE_PROP_KEYS };
