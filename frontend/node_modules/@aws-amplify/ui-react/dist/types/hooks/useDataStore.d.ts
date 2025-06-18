import { PersistentModel } from '@aws-amplify/datastore';
import { DataStoreBindingProps, DataStoreCollectionProps, DataStoreCollectionResult, DataStoreItemProps, DataStoreItemResult } from '../primitives/types/datastore';
/**
 * Perform a collection query against a DataStore model
 * @internal
 */
export declare const useDataStoreCollection: <M extends Readonly<Record<string, any>>>({ model, criteria, pagination, }: DataStoreCollectionProps<M>) => DataStoreCollectionResult<M>;
/**
 * Perform a single record query against a DataStore model
 * @internal
 */
export declare const useDataStoreItem: <M extends Readonly<Record<string, any>>>({ model, id, }: DataStoreItemProps<M>) => DataStoreItemResult<M>;
/**
 * Perform a query against a DataStore model
 * @internal
 */
export declare function useDataStoreBinding<Model extends PersistentModel>(props: DataStoreBindingProps<Model, 'record'>): DataStoreItemResult<Model>;
export declare function useDataStoreBinding<Model extends PersistentModel>(props: DataStoreBindingProps<Model, 'collection'>): DataStoreCollectionResult<Model>;
