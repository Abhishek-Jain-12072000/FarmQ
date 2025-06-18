import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
import { FileUploaderTokens } from './fileUploader';
export interface StorageManagerTokens<OutputType extends OutputVariantKey> extends Omit<FileUploaderTokens<OutputType>, 'body' | 'previewer'> {
    filelist?: DesignTokenProperties<'flexDirection' | 'gap'>;
    previewer?: {
        footer?: DesignTokenProperties<'justifyContent', OutputType>;
    };
}
export declare const storagemanager: Required<StorageManagerTokens<'default'>>;
