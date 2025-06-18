import { DesignTokenProperties, OutputVariantKey } from '../types/designToken';
type StateTokens<Output> = DesignTokenProperties<'backgroundColor' | 'borderColor' | 'color', Output>;
type ButtonTokens<Output> = DesignTokenProperties<'color', Output> & {
    _active?: StateTokens<Output>;
    _disabled?: StateTokens<Output>;
    _focus?: StateTokens<Output>;
    _hover?: StateTokens<Output>;
};
export type PasswordFieldTokens<Output extends OutputVariantKey> = DesignTokenProperties<'color', Output> & {
    button?: ButtonTokens<Output>;
};
export declare const passwordfield: Required<PasswordFieldTokens<'default'>>;
export {};
