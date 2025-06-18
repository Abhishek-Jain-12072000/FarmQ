import { DesignTokenValues, OutlineOffsetValue, OutputVariantKey } from './types/designToken';
type OutlineOffsetSize = 'small' | 'medium' | 'large';
export type OutlineOffsets<Output extends OutputVariantKey = unknown, Platform = unknown> = DesignTokenValues<OutlineOffsetSize, OutlineOffsetValue, Output, Platform>;
export declare const outlineOffsets: OutlineOffsets<'default'>;
export {};
