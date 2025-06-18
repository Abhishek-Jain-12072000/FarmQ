/**
 * This file contains general helpers that state machine or authenticator
 * implementations can use.
 */
import { AuthInterpreter, AuthMachineHubHandler } from '../../types';
type ConfigureOptions = {
    packageName: string;
    version: string;
};
export declare const configureComponent: ({ packageName, version, }: ConfigureOptions) => void;
export declare const censorAllButFirstAndLast: (value: string) => string;
export declare const censorPhoneNumber: (val: string) => string;
/**
 * Handles Amplify JS Auth hub events, by forwarding hub events as appropriate
 * xstate events.
 */
export declare const defaultAuthHubHandler: AuthMachineHubHandler;
/**
 * Listens to external auth Hub events and sends corresponding event to
 * the `authService` of interest
 *
 * @param send - `send` function associated with the `authService` of interest
 *
 * @returns function that unsubscribes to the hub evenmt
 */
export declare const listenToAuthHub: (service: AuthInterpreter, handler?: AuthMachineHubHandler) => () => void;
export declare const hasSpecialChars: (password: string) => boolean;
export declare const getTotpCodeURL: (issuer: string, username: string, secret: string) => string;
export declare function trimValues<T extends Record<string, string>>(values: T, ...ignored: string[]): T;
export declare const isValidEmail: (value: string | undefined) => boolean;
export {};
