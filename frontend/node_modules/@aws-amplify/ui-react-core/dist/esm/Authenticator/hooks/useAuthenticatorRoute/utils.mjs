import { __rest } from '../../../node_modules/tslib/tslib.es6.mjs';
import RenderNothing from '../../../components/RenderNothing/RenderNothing.mjs';
import { isComponentRouteKey } from '../utils.mjs';
import { MACHINE_PROP_KEYS, EVENT_HANDLER_KEY_MAP } from './constants.mjs';

// only select `route` from machine context
const routeSelector = ({ route }) => [route];
const createSelector = (selectorKeys) => (context) => {
    const dependencies = selectorKeys.map((key) => context[key]);
    // route should always be part of deps, so hook knows when route changes.
    return [...dependencies, context.route];
};
const getRouteMachineSelector = (route) => isComponentRouteKey(route)
    ? createSelector(MACHINE_PROP_KEYS[route])
    : routeSelector;
const isFormEventHandlerKey = (key) => ['updateBlur', 'updateForm', 'submitForm'].includes(key);
const convertEventHandlerKey = (key) => EVENT_HANDLER_KEY_MAP[key];
const getConvertedMachineProps = (route, context) => MACHINE_PROP_KEYS[route].reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [isFormEventHandlerKey(key) ? convertEventHandlerKey(key) : key]: context[key] })), {});
function resolveConfirmResetPasswordRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('confirmResetPassword', props)),
    };
}
function resolveConfirmSignInRoute(Component, props) {
    const _a = getConvertedMachineProps('confirmSignIn', props), { user } = _a, machineProps = __rest(_a, ["user"]);
    // prior to the `confirmSignIn` route, `user.username` is populated
    const challengeName = user.challengeName;
    return { Component, props: Object.assign(Object.assign(Object.assign({}, Component), machineProps), { challengeName }) };
}
function resolveConfirmSignUpRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('confirmSignUp', props)),
    };
}
function resolveConfirmVerifyUserRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('confirmVerifyUser', props)),
    };
}
function resolveForceNewPasswordRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('forceNewPassword', props)),
    };
}
function resolveResetPasswordRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('resetPassword', props)),
    };
}
function resolveSetupTOTPRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('setupTOTP', props)),
    };
}
function resolveSignInRoute(Component, props) {
    // default `hideSignUp` to false
    const hideSignUp = false;
    return {
        Component,
        props: Object.assign(Object.assign(Object.assign({}, Component), getConvertedMachineProps('signIn', props)), { hideSignUp }),
    };
}
function resolveSignUpRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('signUp', props)),
    };
}
function resolveVerifyUserRoute(Component, props) {
    return {
        Component,
        props: Object.assign(Object.assign({}, Component), getConvertedMachineProps('verifyUser', props)),
    };
}
function resolveDefault() {
    return {
        Component: RenderNothing,
        props: {},
    };
}

export { getRouteMachineSelector, resolveConfirmResetPasswordRoute, resolveConfirmSignInRoute, resolveConfirmSignUpRoute, resolveConfirmVerifyUserRoute, resolveDefault, resolveForceNewPasswordRoute, resolveResetPasswordRoute, resolveSetupTOTPRoute, resolveSignInRoute, resolveSignUpRoute, resolveVerifyUserRoute, routeSelector };
