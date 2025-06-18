import { DesignTokenValues, FontValue, OutputVariantKey } from './types/designToken';
type FontVariant = 'variable' | 'static';
type BaseFonts<Output extends OutputVariantKey = unknown, Platform = unknown> = {
    default?: DesignTokenValues<FontVariant, FontValue, Output, Platform>;
};
export type Fonts<Output extends OutputVariantKey = unknown, Platform = unknown> = Output extends 'required' | 'default' ? Required<BaseFonts<Output, Platform>> : BaseFonts<Output, Platform>;
export declare const fonts: Fonts<'default'>;
export {};
