import { __awaiter } from '../../../node_modules/tslib/tslib.es6.mjs';
import { Auth } from 'aws-amplify';
import { getActorContext, getSortedFormFields, isString, areEmptyArrays, areEmptyObjects } from '@aws-amplify/ui';
import { isComponentRouteKey } from '../utils.mjs';

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
        if (areEmptyArrays(currentDep, nextDep) ||
            areEmptyObjects(currentDep, nextDep)) {
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
    return (Object.assign({}, (_c = (_b = (_a = getActorContext(state)) === null || _a === void 0 ? void 0 : _a.formFields) === null || _b === void 0 ? void 0 : _b.setupTOTP) === null || _c === void 0 ? void 0 : _c.QR));
};
const getTotpSecretCodeCallback = (user) => function getTotpSecretCode() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Auth.setupTOTP(user);
    });
};
const flattenFormFields = (fields) => fields.flatMap(([name, options]) => (Object.assign({ name }, options)));
const convertContactMethodsToFields = (unverifiedContactMethods) => {
    return (unverifiedContactMethods &&
        Object.entries(unverifiedContactMethods).map(([name, value]) => {
            const valueIsString = isString(value);
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
            : flattenFormFields(getSortedFormFields(route, state));
    }
    return [];
};

export { areSelectorDepsEqual, defaultComparator, getComparator, getMachineFields, getQRFields, getTotpSecretCodeCallback };
