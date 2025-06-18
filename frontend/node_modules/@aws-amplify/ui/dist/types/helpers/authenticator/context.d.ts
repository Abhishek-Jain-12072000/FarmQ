/**
 * This file contains helpers that process authenticator state machine context
 */
import { AuthContext, AuthMachineState } from '../../types';
export declare const getPrimaryAlias: (state: AuthMachineState) => "email" | "phone_number" | "username";
/**
 * Given xstate context from AuthMachine, returns the primaryAlias and
 * secondaryAliases.
 */
export declare const getConfiguredAliases: (context: AuthContext) => {
    primaryAlias: "email" | "phone_number" | "username";
    secondaryAliases: ("email" | "phone_number" | "username")[];
};
