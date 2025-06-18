import { AuthMachineState, FormFields, FormFieldOptions, FormFieldComponents } from '../../../types';
export declare const getAliasDefaultFormField: (state: AuthMachineState) => FormFieldOptions;
/** Collect all the defaultFormFields getters */
export declare const defaultFormFieldsGetters: Record<FormFieldComponents, (state: AuthMachineState) => FormFields>;
