import { RecursiveModelPredicateExtender } from '@aws-amplify/datastore';
import { DataStorePredicateObject } from '../types/datastore';
/**
 * Creates a DataStore compatible predicate function from an object representation
 * @internal
 */
export declare const createDataStorePredicate: <Model extends Readonly<Record<string, any>>>(predicateObject: DataStorePredicateObject) => RecursiveModelPredicateExtender<Model>;
