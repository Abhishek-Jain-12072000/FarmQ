import { AuthEvent, ResetPasswordContext } from '../../../types';
import { defaultServices } from '../defaultServices';
export type ResetPasswordMachineOptions = {
    services?: Partial<typeof defaultServices>;
};
export declare function resetPasswordActor({ services }: ResetPasswordMachineOptions): import("xstate").StateMachine<ResetPasswordContext, any, AuthEvent, {
    value: any;
    context: ResetPasswordContext;
}, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, AuthEvent, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
