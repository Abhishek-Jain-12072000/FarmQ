import { __rest } from '../../../node_modules/tslib/tslib.es6.mjs';
import React__default, { useCallback } from 'react';
import { useSelector } from '@xstate/react';
import { getServiceFacade } from '@aws-amplify/ui';
import 'aws-amplify';
import { AuthenticatorContext } from '../../context/AuthenticatorContext.mjs';
import { USE_AUTHENTICATOR_ERROR } from './constants.mjs';
import { getQRFields, getMachineFields, getTotpSecretCodeCallback, getComparator, defaultComparator } from './utils.mjs';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator/headless#useauthenticator-hook)
 */
function useAuthenticator(selector) {
    const context = React__default.useContext(AuthenticatorContext);
    if (!context) {
        throw new Error(USE_AUTHENTICATOR_ERROR);
    }
    const { service } = context;
    const { send } = service;
    const xstateSelector = useCallback((state) => (Object.assign({}, getServiceFacade({ send, state }))), [send]);
    const comparator = selector ? getComparator(selector) : defaultComparator;
    // the purpose of `context.authStatus`is to intentionally override `facade.authStatus`. `facade.authStatus` does
    // not update on external sign in events (for example when a user is not using the `Authenticator`).
    const { authStatus } = context;
    const facade = useSelector(service, xstateSelector, comparator);
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

export { useAuthenticator as default };
