import { AuthChallengeName, CodeDeliveryDetails, SocialProvider } from '../../types';
import { AuthenticatorRoute } from './facade';
export declare const authenticatorTextUtil: {
    /** Shared */
    readonly getBackToSignInText: () => string;
    readonly getChangePasswordText: () => string;
    readonly getChangingText: () => string;
    readonly getConfirmText: () => string;
    readonly getConfirmingText: () => string;
    readonly getCopyText: () => string;
    readonly getHidePasswordText: () => string;
    readonly getLoadingText: () => string;
    readonly getOrText: () => string;
    readonly getResendCodeText: () => string;
    readonly getSendCodeText: () => string;
    readonly getSendingText: () => string;
    readonly getShowPasswordText: () => string;
    readonly getSubmitText: () => string;
    readonly getSubmittingText: () => string;
    /** SignInSignUpTabs */
    readonly getSignInTabText: () => string;
    readonly getSignUpTabText: () => string;
    /** SignIn */
    readonly getForgotPasswordText: (shortVersion?: boolean) => string;
    readonly getSigningInText: () => string;
    readonly getSignInText: () => string;
    /** SignUp */
    readonly getCreatingAccountText: () => string;
    readonly getCreateAccountText: () => string;
    /** ConfirmSignUp */
    readonly getDeliveryMessageText: (codeDeliveryDetails: CodeDeliveryDetails) => string;
    readonly getDeliveryMethodText: (codeDeliveryDetails: CodeDeliveryDetails) => string;
    /** ConfirmSignIn */
    readonly getChallengeText: (challengeName?: AuthChallengeName) => string;
    /** ResetPassword */
    readonly getResetYourPasswordText: () => string;
    /** SetupTOTP */
    readonly getSetupTOTPText: () => string;
    readonly getSetupTOTPInstructionsText: () => string;
    readonly getCopiedText: () => string;
    /** FederatedSignIn */
    readonly getSignInWithFederationText: (route: AuthenticatorRoute, provider: SocialProvider) => string;
    /** VerifyUser */
    readonly getSkipText: () => string;
    readonly getVerifyText: () => string;
    readonly getVerifyContactText: () => string;
    readonly getAccountRecoveryInfoText: () => string;
    /** Validations */
    readonly getInvalidEmailText: () => string;
    readonly getRequiredFieldText: () => string;
};
