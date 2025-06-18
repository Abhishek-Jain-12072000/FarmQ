import React from 'react';
import { AuthenticatorProps, SignOut } from './Authenticator';
import { AmplifyUser } from '@aws-amplify/ui';
export type WithAuthenticatorOptions = Omit<AuthenticatorProps, 'children'>;
export interface WithAuthenticatorProps {
    signOut?: SignOut;
    user?: AmplifyUser;
}
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
export declare function withAuthenticator<Props = {}>(Component: React.ComponentType<Props & WithAuthenticatorProps>, options?: WithAuthenticatorOptions): (props: Props) => JSX.Element;
