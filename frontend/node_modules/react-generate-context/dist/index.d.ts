import * as React from 'react';
declare type Children = {
    children: React.ReactNode;
};
declare type UseGetContextValue<Props, Context> = (props: Props) => Context;
declare type Options<Context> = {
    defaultContext?: Context;
    requireProvider?: boolean;
    missingProviderMessage?: string;
};
declare type Provider<Props> = (props: Props & Children) => JSX.Element;
declare type Hook<Context> = () => Context | undefined;
/**
 * A function for generating a Provider and Hook for a React Context
 *
 * @arg useGetContextValue - A custom hook function used to get the `value` prop passed to the generated Provider
 * @arg options - Additional options for generating the Context
 */
export default function generateContext<Props, Context>(useGetContextValue: UseGetContextValue<Props, Context>, options?: Options<Context>): [Provider<Props>, Hook<Context>];
export {};
