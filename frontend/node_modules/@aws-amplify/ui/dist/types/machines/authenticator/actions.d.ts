import { ActorContextWithForms, AuthEvent, SignInContext, SignUpContext } from '../../types';
export declare const stopActor: (machineId: string) => import("xstate").StopAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
/**
 * https://github.com/statelyai/xstate/issues/866
 *
 * Actions in Xstate take in two arguments - a `context` and
 * an `event`.
 *
 * When writing reusable actions in a separate file for Xstate,
 * you cannot specify the type for both the `context` and the `event`.
 * The bug has been around for 2 years with seemingly no resolution
 * in sight.
 *
 * TypeScript apparently has trouble inferring Xstate properly.
 * So, when writing actions, only specify the type for either `context`
 * or `event` - but not both.
 *
 * https://xstate.js.org/docs/guides/typescript.html#assign-action-behaving-strangely
 *
 * Each of the actions NEEDS at least the `context` argument in the
 * `assign` body - even if it is unused. This is another known bug in
 * how TypeScript integrate with Xstate.
 */
/**
 * "clear" actions
 */
export declare const clearAttributeToVerify: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearChallengeName: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearRequiredAttributes: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearError: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearFormValues: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearTouched: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearUnverifiedContactMethods: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearUsername: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const clearValidationError: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
/**
 * "set" actions
 */
export declare const setTotpSecretCode: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setChallengeName: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setRequiredAttributes: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setConfirmResetPasswordIntent: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const setConfirmSignUpIntent: import("xstate").AssignAction<unknown, import("xstate").EventObject, import("xstate").EventObject>;
export declare const setCredentials: import("xstate").AssignAction<SignInContext | SignUpContext, import("xstate").EventObject, import("xstate").EventObject>;
export declare const setFieldErrors: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setRemoteError: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setUnverifiedContactMethods: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setUser: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setUsername: import("xstate").AssignAction<ActorContextWithForms, import("xstate").EventObject, import("xstate").EventObject>;
export declare const setCodeDeliveryDetails: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const setUsernameAuthAttributes: import("xstate").AssignAction<ActorContextWithForms, import("xstate").EventObject, import("xstate").EventObject>;
export declare const handleInput: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const handleSubmit: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const handleBlur: import("xstate").AssignAction<unknown, AuthEvent, AuthEvent>;
export declare const resendCode: (context: any) => Promise<any>;
/**
 * This action occurs on the entry to a state where a form submit action
 * occurs. It combines the phone_number and country_code form values, parses
 * the result, and updates the form values with the full phone number which is
 * the required format by Cognito for form submission.
 */
export declare const parsePhoneNumber: import("xstate").AssignAction<SignInContext | SignUpContext, import("xstate").EventObject, import("xstate").EventObject>;
