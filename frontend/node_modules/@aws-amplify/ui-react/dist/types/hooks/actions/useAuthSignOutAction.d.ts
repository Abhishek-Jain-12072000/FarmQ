import { SignOutOpts } from '@aws-amplify/auth/lib-esm/types/Auth';
export interface UseAuthSignOutAction {
    (options?: SignOutOpts): () => Promise<void>;
}
/**
 * Action to Signout of Authenticated session
 * @internal
 */
export declare const useAuthSignOutAction: UseAuthSignOutAction;
