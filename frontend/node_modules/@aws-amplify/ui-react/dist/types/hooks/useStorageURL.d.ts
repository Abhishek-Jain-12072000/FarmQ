import { S3ProviderGetConfig } from '@aws-amplify/storage';
interface UseStorageURLParams {
    key: string;
    options?: S3ProviderGetConfig;
    fallbackURL?: string;
    onStorageGetError?: (error: Error) => void;
}
/**
 * Computes a public URL for an Amplify Storage file
 * @internal
 */
export declare const useStorageURL: ({ key, options, fallbackURL, onStorageGetError, }: UseStorageURLParams) => string | undefined;
export {};
