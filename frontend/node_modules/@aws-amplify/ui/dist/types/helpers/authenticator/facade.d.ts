/**
 * This file contains helpers that translates xstate internals to more
 * understandable authenticator contexts. We provide these contexts with
 * `useAuthenticator` hook/composable/service.
 */
import { Sender } from 'xstate';
import { AuthEvent, AuthEventData, AuthMachineState, CodeDeliveryDetails, AmplifyUser, ValidationError, SocialProvider, UnverifiedContactMethods } from '../../types';
export type AuthenticatorRoute = 'authenticated' | 'confirmResetPassword' | 'confirmSignIn' | 'confirmSignUp' | 'confirmVerifyUser' | 'forceNewPassword' | 'idle' | 'resetPassword' | 'setup' | 'signOut' | 'setupTOTP' | 'signIn' | 'signUp' | 'transition' | 'verifyUser';
type AuthenticatorValidationErrors = ValidationError;
export type AuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';
interface AuthenticatorServiceContextFacade {
    authStatus: AuthStatus;
    codeDeliveryDetails: CodeDeliveryDetails;
    error: string;
    hasValidationErrors: boolean;
    isPending: boolean;
    route: AuthenticatorRoute;
    socialProviders: SocialProvider[];
    totpSecretCode: string | null;
    unverifiedContactMethods: UnverifiedContactMethods;
    user: AmplifyUser;
    validationErrors: AuthenticatorValidationErrors;
}
type SendEventAlias = 'initializeMachine' | 'resendCode' | 'signOut' | 'submitForm' | 'updateForm' | 'updateBlur' | 'toFederatedSignIn' | 'toResetPassword' | 'toSignIn' | 'toSignUp' | 'skipVerification';
type AuthenticatorSendEventAliases = Record<SendEventAlias, (data?: AuthEventData) => void>;
export interface AuthenticatorServiceFacade extends AuthenticatorSendEventAliases, AuthenticatorServiceContextFacade {
}
/**
 * Creates public facing auth helpers that abstracts out xstate implementation
 * detail. Each framework implementation can export these helpers so that
 * developers can send events without having to learn internals.
 *
 * ```
 * const [state, send] = useActor(...);
 * const { submit } = getSendEventAliases(send);
 * submit({ username, password})
 * ```
 */
export declare const getSendEventAliases: (send: Sender<AuthEvent>) => AuthenticatorSendEventAliases;
export declare const getServiceContextFacade: (state: AuthMachineState) => AuthenticatorServiceContextFacade;
export declare const getServiceFacade: ({ send, state, }: {
    send: Sender<AuthEvent>;
    state: AuthMachineState;
}) => AuthenticatorServiceFacade;
export {};
