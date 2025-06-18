import { createContext, createElement, useContext } from 'react';

var defaultMissingProviderMessage = 'The hook for this context cannot be used outside of its Provider';
/**
 * A function for generating a Provider and Hook for a React Context
 *
 * @arg useGetContextValue - A custom hook function used to get the `value` prop passed to the generated Provider
 * @arg options - Additional options for generating the Context
 */

function generateContext(useGetContextValue, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      defaultContext = _options.defaultContext,
      _options$requireProvi = _options.requireProvider,
      requireProvider = _options$requireProvi === void 0 ? true : _options$requireProvi,
      _options$missingProvi = _options.missingProviderMessage,
      missingProviderMessage = _options$missingProvi === void 0 ? defaultMissingProviderMessage : _options$missingProvi;
  /**
   * Creates a Context in closure
   */

  var Ctx = createContext(defaultContext);
  /**
   * The Provider with which to use this Context
   */

  var Provider = function Provider(props) {
    var value = useGetContextValue(props);
    return createElement(Ctx.Provider, {
      value: value
    }, props.children);
  };
  /**
   * The hook for consuming the generated Context
   */


  var useThisContext = function useThisContext() {
    var context = useContext(Ctx);

    if (requireProvider && context === undefined) {
      throw new Error(missingProviderMessage);
    }

    return context;
  };

  return [Provider, useThisContext];
}

export default generateContext;
//# sourceMappingURL=react-generate-context.esm.js.map
