import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
type ExpanderItemTokens<Output> = DesignTokenProperties<'marginTop' | 'boxShadow' | 'borderBottomLeftRadius' | 'borderBottomRightRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderStartStartRadius' | 'borderStartEndRadius' | 'borderEndStartRadius' | 'borderEndEndRadius', Output> & {
    _focus?: DesignTokenProperties<'boxShadow', Output>;
};
type ExpanderTriggerTokens<Output> = DesignTokenProperties<'minHeight' | 'paddingInlineStart' | 'paddingInlineEnd' | 'alignItems' | 'justifyContent', Output> & {
    _hover?: DesignTokenProperties<'backgroundColor', Output>;
};
type ExpanderContentStateTokens<Output> = DesignTokenProperties<'animationDuration' | 'animationTimingFunction', Output>;
type ExpanderContentTokens<Output> = DesignTokenProperties<'paddingInlineStart' | 'paddingInlineEnd', Output> & {
    text?: DesignTokenProperties<'color' | 'paddingBlockStart' | 'paddingBlockEnd', Output>;
    _open?: ExpanderContentStateTokens<Output>;
    _closed?: ExpanderContentStateTokens<Output>;
};
export type ExpanderTokens<Output extends OutputVariantKey> = DesignTokenProperties<'display' | 'backgroundColor' | 'borderRadius' | 'boxShadow' | 'width', Output> & {
    content?: ExpanderContentTokens<Output>;
    header?: DesignTokenProperties<'boxShadow', Output>;
    item?: ExpanderItemTokens<Output>;
    trigger?: ExpanderTriggerTokens<Output>;
    icon?: DesignTokenProperties<'transitionDuration' | 'transitionTimingFunction', Output>;
};
export declare const expander: Required<ExpanderTokens<'default'>>;
export {};
