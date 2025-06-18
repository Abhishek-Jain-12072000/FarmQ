/// <reference types="amazon-cognito-identity-js" />
import { AuthChallengeName, PasswordSettings, SignInResult, ValidatorResult } from '../../types';
export declare const defaultServices: {
    getAmplifyConfig(): Promise<{}>;
    getCurrentUser(): Promise<any>;
    handleSignUp(formData: any): Promise<import("amazon-cognito-identity-js").ISignUpResult>;
    handleSignIn({ username, password, }: {
        username: string;
        password: string;
    }): Promise<any>;
    handleConfirmSignIn({ user, code, mfaType, }: {
        user: any;
        code: string;
        mfaType: AuthChallengeName;
    }): Promise<any>;
    handleConfirmSignUp({ username, code, }: {
        username: string;
        code: string;
    }): Promise<any>;
    handleForgotPasswordSubmit({ username, code, password, }: {
        username: string;
        code: string;
        password: string;
    }): Promise<SignInResult>;
    handleForgotPassword(formData: any): Promise<any>;
    validateCustomSignUp(formData: any, touchData: any): Promise<ValidatorResult>;
    validateFormPassword<Validator>(formData: any, touchData: any, passwordSettings: PasswordSettings): Promise<ValidatorResult>;
    validateConfirmPassword<Validator_1>(formData: any, touchData: any): Promise<ValidatorResult>;
    validatePreferredUsername(formData: any, touchData: any): Promise<ValidatorResult>;
};
