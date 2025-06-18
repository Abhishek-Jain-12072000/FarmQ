import * as React from 'react';
export type NavigateType = 'url' | 'anchor' | 'reload';
export interface UseNavigateActionOptions {
    type: NavigateType;
    url?: string;
    anchor?: string;
    target?: React.HTMLAttributeAnchorTarget;
}
export declare const windowFeatures = "noopener noreferrer";
export declare const defaultTarget = "_self";
/**
 * Action to instruct user’s browser to change current location
 * @internal
 */
export declare const useNavigateAction: (options: UseNavigateActionOptions) => (() => void);
