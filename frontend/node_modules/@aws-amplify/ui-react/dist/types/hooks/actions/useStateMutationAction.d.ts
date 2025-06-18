type UseStateMutationAction<StateType> = [
    StateType,
    (newState: StateType) => void
];
/**
 * Action to wrap React.useState with Hub events
 * @internal
 */
export declare const useStateMutationAction: <StateType>(initialState: StateType) => UseStateMutationAction<StateType>;
export {};
