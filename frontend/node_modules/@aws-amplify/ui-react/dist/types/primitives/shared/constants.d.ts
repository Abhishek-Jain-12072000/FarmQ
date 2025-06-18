import { ThemeStylePropKey, ThemeTokenKey } from '../types/theme';
import { ComponentClassNames as ComponentClassNamesType, ComponentClassNameItems } from './types';
/**
 * @internal May be removed in a future release
 */
export declare const ComponentClassObject: ComponentClassNameItems;
export declare const ComponentClassNames: ComponentClassNamesType;
export declare const ComponentText: {
    Alert: {
        dismissButtonLabel: string;
    };
    Autocomplete: {
        emptyText: string;
        loadingText: string;
    };
    Collection: {
        searchButtonLabel: string;
        searchNoResultsFound: string;
    };
    Fields: {
        clearButtonLabel: string;
    };
    Message: {
        dismissLabel: string;
    };
    PaginationItem: {
        currentPageLabel: string;
        nextLabel: string;
        pageLabel: string;
        previousLabel: string;
    };
    PhoneNumberField: {
        countryCodeLabel: string;
    };
    SearchField: {
        searchButtonLabel: string;
    };
    PasswordField: {
        passwordIsHidden: string;
        passwordIsShown: string;
        showPassword: string;
    };
    StepperField: {
        increaseButtonLabel: string;
        decreaseButtonLabel: string;
    };
};
export declare const stylePropsToThemeKeys: Record<ThemeStylePropKey, ThemeTokenKey>;
export declare const ESCAPE_KEY = "Escape";
export declare const ENTER_KEY = "Enter";
export declare const ARROW_UP = "ArrowUp";
export declare const ARROW_DOWN = "ArrowDown";
