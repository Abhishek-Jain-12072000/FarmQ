import * as React from 'react';
import { WebTheme } from '@aws-amplify/ui';
export interface AmplifyContextType {
    theme: WebTheme;
}
export declare const AmplifyContext: React.Context<AmplifyContextType>;
