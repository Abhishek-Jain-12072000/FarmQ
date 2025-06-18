import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
export type RadioGroupTokens<Output extends OutputVariantKey> = {
    radio?: DesignTokenProperties<'borderWidth' | 'borderColor' | 'backgroundColor', Output> & {
        _checked?: DesignTokenProperties<'color', Output>;
        label?: DesignTokenProperties<'color', Output>;
    };
    label?: DesignTokenProperties<'color', Output>;
};
export declare const radiogroup: Required<RadioGroupTokens<'default'>>;
