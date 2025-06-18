import { DesignTokenValues, FontSizeValue, OutputVariantKey } from './types/designToken';
type FontSize = 'xxxs' | 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
export type FontSizes<Output extends OutputVariantKey = unknown, Platform = unknown> = DesignTokenValues<FontSize, FontSizeValue<Platform, Output>, Output, Platform>;
export declare const fontSizes: FontSizes<'default'>;
export {};
