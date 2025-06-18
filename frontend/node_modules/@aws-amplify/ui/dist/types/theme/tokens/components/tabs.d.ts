import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
type TabItemStateTokens<OutputType> = DesignTokenProperties<'backgroundColor' | 'borderColor' | 'color', OutputType>;
type TabItemTokens<OutputType extends OutputVariantKey> = DesignTokenProperties<'backgroundColor' | 'borderColor' | 'borderStyle' | 'borderWidth' | 'color' | 'fontSize' | 'fontWeight' | 'paddingVertical' | 'paddingHorizontal' | 'textAlign' | 'transitionDuration', OutputType> & {
    _hover?: DesignTokenProperties<'color', OutputType>;
    _focus?: DesignTokenProperties<'color', OutputType>;
    _active?: TabItemStateTokens<OutputType>;
    _disabled?: TabItemStateTokens<OutputType>;
};
export type TabsTokens<Output extends OutputVariantKey> = DesignTokenProperties<'backgroundColor' | 'borderColor' | 'borderStyle' | 'borderWidth' | 'gap', Output> & {
    item?: TabItemTokens<Output>;
};
export declare const tabs: Required<TabsTokens<'default'>>;
export {};
