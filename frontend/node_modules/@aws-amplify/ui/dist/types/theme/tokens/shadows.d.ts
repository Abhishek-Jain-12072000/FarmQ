import { DesignTokenValues, OutputVariantKey, ShadowValue } from './types/designToken';
type ShadowSize = 'small' | 'medium' | 'large';
export type Shadows<Output extends OutputVariantKey = unknown, Platform = unknown> = DesignTokenValues<ShadowSize, ShadowValue, Output, Platform>;
export declare const shadows: Shadows<'default'>;
export {};
