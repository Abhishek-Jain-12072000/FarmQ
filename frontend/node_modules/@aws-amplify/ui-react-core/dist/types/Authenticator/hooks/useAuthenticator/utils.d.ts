import { AmplifyUser, AuthenticatorRoute, AuthMachineState, UnverifiedContactMethods } from '@aws-amplify/ui';
import { AuthenticatorLegacyFields } from '../types';
import { Comparator, UseAuthenticatorSelector } from './types';
export declare const defaultComparator: () => false;
/**
 * Does an ordering and shallow comparison of each array value,
 * plus a value equality check for empty objects and arrays.
 */
export declare function areSelectorDepsEqual<T>(currentDeps: T[], nextDeps: T[]): boolean;
export declare const getComparator: (selector: UseAuthenticatorSelector) => Comparator;
export declare const getQRFields: (state: AuthMachineState) => {
    totpIssuer?: string;
    totpUsername?: string;
};
export declare const getTotpSecretCodeCallback: (user: AmplifyUser) => () => Promise<string>;
/**
 * Retrieves default and custom (RWA only, to be updated) form field values from state machine
 * for subcomponent routes that render fields
 */
export declare const getMachineFields: (route: AuthenticatorRoute, state: AuthMachineState, unverifiedContactMethods: UnverifiedContactMethods) => AuthenticatorLegacyFields;
