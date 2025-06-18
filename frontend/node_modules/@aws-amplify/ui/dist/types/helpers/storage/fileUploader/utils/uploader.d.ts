import { StorageAccessLevel, PutResult } from '@aws-amplify/storage';
export declare function uploadFile({ file, fileName, level, progressCallback, errorCallback, completeCallback, isResumable, provider, ...rest }: {
    file: File;
    fileName: string;
    level: StorageAccessLevel;
    isResumable?: boolean;
    progressCallback: (progress: {
        loaded: number;
        total: number;
    }) => void;
    errorCallback: (error: string) => void;
    completeCallback: (event: PutResult) => void;
    provider?: string;
}): Promise<any>;
/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export declare function humanFileSize(bytes: number, si?: boolean, dp?: number): string;
export declare const checkMaxSize: (maxSize: number, file: File) => string | null;
export declare const returnAcceptedFiles: (files: File[], acceptedFileTypes: string[]) => File[];
export declare const isValidExtension: (fileName: string, fileName2: string) => boolean;
