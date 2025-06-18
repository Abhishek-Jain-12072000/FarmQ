'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var react = require('@xstate/react');
var awsAmplify = require('aws-amplify');
var ui = require('@aws-amplify/ui');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var React__namespace = /*#__PURE__*/_interopNamespace(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * AuthenticatorContext serves static reference to the auth machine service.
 *
 * https://xstate.js.org/docs/recipes/react.html#context-provider
 */
const AuthenticatorContext = React__default["default"].createContext(null);

const createHubHandler = (options) => (data, service) => __awaiter(void 0, void 0, void 0, function* () {
    yield ui.defaultAuthHubHandler(data, service, options);
});
function AuthenticatorProvider({ children, }) {
    // `authStatus` is exposed by `useAuthenticator` but should not be derived directly from the
    // state machine as the machine only updates on `Authenticator` initiated events, which
    // leads to scenarios where the state machine `authStatus` gets "stuck". For exmample,
    // if a user was to sign in using `Auth.signIn` directly rather than using `Authenticator`
    const [authStatus, setAuthStatus] = React__default["default"].useState('configuring');
    // only run on first render
    React__default["default"].useEffect(() => {
        awsAmplify.Auth.currentAuthenticatedUser()
            .then(() => {
            setAuthStatus('authenticated');
        })
            .catch(() => {
            setAuthStatus('unauthenticated');
        });
    }, []);
    /**
     * Based on use cases, developer might already have added another Provider
     * outside Authenticator. In that case, we sync the two providers by just
     * passing the parent value.
     *
     * TODO(BREAKING): enforce only one provider in App tree
     */
    const parentProviderVal = React.useContext(AuthenticatorContext);
    const service = react.useInterpret(ui.createAuthenticatorMachine);
    const value = React.useMemo(() => (!parentProviderVal ? { authStatus, service } : parentProviderVal), [authStatus, parentProviderVal, service]);
    const { service: activeService } = value;
    React.useEffect(() => {
        const onSignIn = () => {
            setAuthStatus('authenticated');
        };
        const onSignOut = () => {
            setAuthStatus('unauthenticated');
        };
        const unsubscribe = ui.listenToAuthHub(activeService, createHubHandler({ onSignIn, onSignOut }));
        return unsubscribe;
    }, [activeService]);
    return (React__default["default"].createElement(AuthenticatorContext.Provider, { value: value }, children));
}

const USE_AUTHENTICATOR_ERROR = '`useAuthenticator` must be used inside an `Authenticator.Provider`.';

const COMPONENT_ROUTE_KEYS = [
    'confirmResetPassword',
    'confirmSignIn',
    'confirmSignUp',
    'confirmVerifyUser',
    'forceNewPassword',
    'resetPassword',
    'setupTOTP',
    'signIn',
    'signUp',
    'verifyUser',
];
const COMPONENT_ROUTE_NAMES = [
    'ConfirmResetPassword',
    'ConfirmSignIn',
    'ConfirmSignUp',
    'ConfirmVerifyUser',
    'ForceNewPassword',
    'ResetPassword',
    'SetupTOTP',
    'SignIn',
    'SignUp',
    'VerifyUser',
];

const isComponentRouteKey = (route) => COMPONENT_ROUTE_KEYS.some((componentRoute) => componentRoute === route);
function resolveAuthenticatorComponents(defaults, overrides) {
    if (!overrides) {
        return defaults;
    }
    return COMPONENT_ROUTE_NAMES.reduce((components, route) => {
        const Default = defaults[route];
        const Override = overrides[route];
        if (typeof Override !== 'function') {
            return Object.assign(Object.assign({}, components), { [route]: Default });
        }
        const { Footer, FormFields, Header } = Default;
        // cast to allow assigning of component slots
        const Component = Override;
        Component.Footer = Footer;
        Component.FormFields = FormFields;
        Component.Header = Header;
        return Object.assign(Object.assign({}, components), { [route]: Component });
    }, {});
}

const defaultComparator = () => false;
/**
 * Does an ordering and shallow comparison of each array value,
 * plus a value equality check for empty objects and arrays.
 */
function areSelectorDepsEqual(currentDeps, nextDeps) {
    if (currentDeps.length !== nextDeps.length) {
        return false;
    }
    return currentDeps.every((currentDep, index) => {
        const nextDep = nextDeps[index];
        if (ui.areEmptyArrays(currentDep, nextDep) ||
            ui.areEmptyObjects(currentDep, nextDep)) {
            return true;
        }
        return currentDep === nextDep;
    });
}
const getComparator = (selector) => (currentFacade, nextFacade) => {
    const currentSelectorDeps = selector(currentFacade);
    const nextSelectorDeps = selector(nextFacade);
    // Shallow compare the array values
    return areSelectorDepsEqual(currentSelectorDeps, nextSelectorDeps);
};
const getQRFields = (state) => {
    var _a, _b, _c;
    return (Object.assign({}, (_c = (_b = (_a = ui.getActorContext(state)) === null || _a === void 0 ? void 0 : _a.formFields) === null || _b === void 0 ? void 0 : _b.setupTOTP) === null || _c === void 0 ? void 0 : _c.QR));
};
const getTotpSecretCodeCallback = (user) => function getTotpSecretCode() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield awsAmplify.Auth.setupTOTP(user);
    });
};
const flattenFormFields = (fields) => fields.flatMap(([name, options]) => (Object.assign({ name }, options)));
const convertContactMethodsToFields = (unverifiedContactMethods) => {
    return (unverifiedContactMethods &&
        Object.entries(unverifiedContactMethods).map(([name, value]) => {
            const valueIsString = ui.isString(value);
            if (!valueIsString || !name) {
                return {};
            }
            return { name, label: value, type: 'radio', value };
        }));
};
/**
 * Retrieves default and custom (RWA only, to be updated) form field values from state machine
 * for subcomponent routes that render fields
 */
const getMachineFields = (route, state, unverifiedContactMethods) => {
    if (isComponentRouteKey(route)) {
        return route === 'verifyUser'
            ? convertContactMethodsToFields(unverifiedContactMethods)
            : flattenFormFields(ui.getSortedFormFields(route, state));
    }
    return [];
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator/headless#useauthenticator-hook)
 */
function useAuthenticator(selector) {
    const context = React__default["default"].useContext(AuthenticatorContext);
    if (!context) {
        throw new Error(USE_AUTHENTICATOR_ERROR);
    }
    const { service } = context;
    const { send } = service;
    const xstateSelector = React.useCallback((state) => (Object.assign({}, ui.getServiceFacade({ send, state }))), [send]);
    const comparator = selector ? getComparator(selector) : defaultComparator;
    // the purpose of `context.authStatus`is to intentionally override `facade.authStatus`. `facade.authStatus` does
    // not update on external sign in events (for example when a user is not using the `Authenticator`).
    const { authStatus } = context;
    const facade = react.useSelector(service, xstateSelector, comparator);
    const { route, totpSecretCode, unverifiedContactMethods, user } = facade, rest = __rest(facade, ["route", "totpSecretCode", "unverifiedContactMethods", "user"]);
    // do not memoize output. `service.getSnapshot` reference remains stable preventing
    // `fields` from updating with current form state on value changes
    const serviceSnapshot = service.getSnapshot();
    // legacy `QRFields` values only used for SetupTOTP page to retrieve issuer information, will be removed in future
    const QRFields = route === 'setupTOTP' ? getQRFields(serviceSnapshot) : null;
    // legacy `formFields` values required until form state is removed from state machine
    const fields = getMachineFields(route, serviceSnapshot, unverifiedContactMethods);
    return Object.assign(Object.assign({}, rest), { authStatus,
        route,
        totpSecretCode,
        unverifiedContactMethods,
        user,
        /** @deprecated For internal use only */
        fields, getTotpSecretCode: getTotpSecretCodeCallback(user), QRFields });
}

/**
 * Utility component for rendering nothing.
 */
function RenderNothing(_) {
    return null;
}

const EVENT_HANDLER_KEY_MAP = {
    updateBlur: 'handleBlur',
    updateForm: 'handleChange',
    submitForm: 'handleSubmit',
};
const COMMON_ROUTE_MACHINE_KEYS = [
    'error',
    'isPending',
    'submitForm',
    'updateBlur',
    'updateForm',
];
const CONFIRM_RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'resendCode',
    'validationErrors',
];
const CONFIRM_SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
    'user',
];
const CONFIRM_SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'codeDeliveryDetails',
    'resendCode',
];
const CONFIRM_VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const FORCE_NEW_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'toSignIn',
    'validationErrors',
];
const RESET_PASSWORD_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
];
const SIGN_IN_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toFederatedSignIn',
    'toResetPassword',
    'toSignUp',
];
const SIGN_UP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'hasValidationErrors',
    'toSignIn',
    'validationErrors',
];
const SETUP_TOTP_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'toSignIn',
    'totpSecretCode',
];
const VERIFY_USER_MACHINE_KEYS = [
    ...COMMON_ROUTE_MACHINE_KEYS,
    'skipVerification',
];
const MACHINE_PROP_KEYS = {
    confirmResetPassword: CONFIRM_RESET_PASSWORD_MACHINE_KEYS,
    confirmSignIn: CONFIRM_SIGN_IN_MACHINE_KEYS,
    confirmSignUp: CONFIRM_SIGN_UP_MACHINE_KEYS,
    confirmVerifyUser: CONFIRM_VERIFY_USER_MACHINE_KEYS,
    forceNewPassword: FORCE_NEW_PASSWORD_MACHINE_KEYS,
    signIn: SIGN_IN_MACHINE_KEYS,
    signUp: SIGN_UP_MACHINE_KEYS,
    resetPassword: RESET_PASSWORD_MACHINE_KEYS,
    setupTOTP: SETUP_TOTP_MACHINE_KEYS,
    verifyUser: VERIFY_USER_MACHINE_KEYS,
};

// only select `route` from machine context
const routeSelector$1 = ({ route }) => [route];
const createSelector = (selectorKeys) => (context) => {
    const dependencies = selectorKeys.map((key) => context[key]);
    // route should always be part of deps, so hook knows when route changes.
    return [...dependencies, context.route];
};
const getRouteMachineSelector = (route) => isComponentRouteKey(route)
    ? createSelector(MACHINE_PROP_KEYS[route])
    : routeSelector$1;
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

function useAuthenticatorRoute({ components, }) {
    const { route } = useAuthenticator(routeSelector$1);
    const routeMachineSelector = React.useMemo(() => getRouteMachineSelector(route), [route]);
    // `useAuthenticator` exposes both state machine (example: `toSignIn`) and non-state machine
    // props (example: `getTotpSecretCode`). `routeSelector` specifies which state machine props
    // should be returned for a specific route.
    // Only state machine props specified by the current `routeSelector` will have their current value
    // returned by `useAuthenticator`, non-machine props returned will always be the current value
    const routeSelectorProps = useAuthenticator(routeMachineSelector);
    const { ConfirmResetPassword, ConfirmSignIn, ConfirmSignUp, ConfirmVerifyUser, ForceNewPassword, ResetPassword, SetupTOTP, SignIn, SignUp, VerifyUser, } = components;
    switch (route) {
        case 'confirmResetPassword': {
            return resolveConfirmResetPasswordRoute(ConfirmResetPassword, routeSelectorProps);
        }
        case 'confirmSignIn': {
            return resolveConfirmSignInRoute(ConfirmSignIn, routeSelectorProps);
        }
        case 'confirmSignUp': {
            return resolveConfirmSignUpRoute(ConfirmSignUp, routeSelectorProps);
        }
        case 'confirmVerifyUser': {
            return resolveConfirmVerifyUserRoute(ConfirmVerifyUser, routeSelectorProps);
        }
        case 'forceNewPassword': {
            return resolveForceNewPasswordRoute(ForceNewPassword, routeSelectorProps);
        }
        case 'resetPassword': {
            return resolveResetPasswordRoute(ResetPassword, routeSelectorProps);
        }
        case 'setupTOTP': {
            return resolveSetupTOTPRoute(SetupTOTP, routeSelectorProps);
        }
        case 'signIn': {
            return resolveSignInRoute(SignIn, routeSelectorProps);
        }
        case 'signUp': {
            return resolveSignUpRoute(SignUp, routeSelectorProps);
        }
        case 'verifyUser': {
            return resolveVerifyUserRoute(VerifyUser, routeSelectorProps);
        }
        default: {
            return resolveDefault();
        }
    }
}

// only select `route` from machine context
const routeSelector = ({ route }) => [route];
function useAuthenticatorInitMachine(data) {
    const { route, initializeMachine } = useAuthenticator(routeSelector);
    const hasInitialized = React__default["default"].useRef(false);
    React__default["default"].useEffect(() => {
        if (!hasInitialized.current && route === 'setup') {
            initializeMachine(data);
            hasInitialized.current = true;
        }
    }, [initializeMachine, route, data]);
}

/**
 * Logs a deprecation warning message.
 *
 * @important Please use the React/React Native specific platform implementations.
 * This version of the hook is a base implementation that the others extend from due
 * to env differences between running in RN or the browser
 */
const useDeprecationWarning = ({ shouldWarn, message, }) => {
    React__namespace.useEffect(() => {
        if (shouldWarn) {
            // eslint-disable-next-line no-console
            console.warn(message);
        }
    }, [shouldWarn, message]);
};

function usePreviousValue(value) {
    const previous = React.useRef();
    // update ref post render
    React.useEffect(() => {
        previous.current = value;
    }, [value]);
    // return previous ref
    return previous.current;
}

/**
 * @param value `value` to track for updates
 * @param ignoreFirstRender whether to ignore initial render. defaults to `false`
 * @returns a boolean representing whether the tracked `value` has updated between renders
 *
 * Returns `false`:
 * - on initial render when ignoring first render
 * - current and previous `value` are equal
 *
 * Returns `true`:
 * - on initial render when not ignoring first render (default behavior)
 * - current and previous `value` are not equal
 */
function useHasValueUpdated(value, ignoreFirstRender = false) {
    const previous = usePreviousValue(value);
    const shouldIgnoreChange = ui.isUndefined(previous) && ignoreFirstRender;
    if (shouldIgnoreChange) {
        return false;
    }
    return previous !== value;
}

exports.AuthenticatorProvider = AuthenticatorProvider;
exports.RenderNothing = RenderNothing;
exports.isAuthenticatorComponentRouteKey = isComponentRouteKey;
exports.resolveAuthenticatorComponents = resolveAuthenticatorComponents;
exports.useAuthenticator = useAuthenticator;
exports.useAuthenticatorInitMachine = useAuthenticatorInitMachine;
exports.useAuthenticatorRoute = useAuthenticatorRoute;
exports.useDeprecationWarning = useDeprecationWarning;
exports.useHasValueUpdated = useHasValueUpdated;
exports.usePreviousValue = usePreviousValue;
