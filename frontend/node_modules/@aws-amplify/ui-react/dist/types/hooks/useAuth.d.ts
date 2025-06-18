import { AmplifyUser } from '@aws-amplify/ui';
export interface UseAuthResult {
    user?: AmplifyUser;
    isLoading: boolean;
    error?: Error;
    /** @deprecated Fetch is handled automatically, do not use this directly */
    fetch?: () => Promise<void>;
}
/**
 * Amplify Auth React hook
 * @internal
 */
export declare const useAuth: () => UseAuthResult;
