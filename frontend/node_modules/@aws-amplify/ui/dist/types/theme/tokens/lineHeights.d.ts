import { DesignTokenValues, LineHeightValue, OutputVariantKey } from './types/designToken';
type LineHeightSize = 'small' | 'medium' | 'large';
export type LineHeights<Output extends OutputVariantKey = unknown, Platform = unknown> = DesignTokenValues<LineHeightSize, LineHeightValue, Output, Platform>;
export declare const lineHeights: LineHeights<'default'>;
export {};
