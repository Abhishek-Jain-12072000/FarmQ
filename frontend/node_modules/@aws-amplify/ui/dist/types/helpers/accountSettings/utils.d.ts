import { AmplifyUser } from '../../types';
type ChangePasswordInput = {
    user: AmplifyUser;
    currentPassword: string;
    newPassword: string;
};
export declare const changePassword: ({ user, currentPassword, newPassword, }: ChangePasswordInput) => Promise<void>;
export declare const deleteUser: () => Promise<void>;
export {};
