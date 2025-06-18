import { Interpreter } from 'xstate';
export declare function partition<T, A extends T, B extends T>(items: T[], predicate: (item: T) => item is A): [A[], B[]];
export declare function getServiceSnapshot<TService extends Interpreter<any, any, any, any>>(service: TService): TService['state'];
export declare function shallowEqual(objA: any, objB: any): boolean;
//# sourceMappingURL=utils.d.ts.map