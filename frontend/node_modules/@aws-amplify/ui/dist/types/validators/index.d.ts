import { AuthFormData, PasswordSettings, Validator } from '../types';
export declare const runValidators: (formData: AuthFormData, touchData: AuthFormData, passwordSettings: PasswordSettings, validators: Validator[]) => Promise<void>;
