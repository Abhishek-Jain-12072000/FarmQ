import { WebTheme } from '@aws-amplify/ui';
import { AmplifyContextType } from '../components/ThemeProvider/AmplifyContext';
/**
 * Get current Theme object value from Amplify context.
 * Returns a default theme if context is not available
 */
export declare const getThemeFromContext: (context: AmplifyContextType) => AmplifyContextType['theme'];
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/theming)
 */
export declare const useTheme: () => WebTheme;
