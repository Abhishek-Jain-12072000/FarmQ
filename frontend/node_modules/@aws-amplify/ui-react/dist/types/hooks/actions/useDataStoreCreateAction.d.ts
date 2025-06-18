import { PersistentModel } from '@aws-amplify/datastore';
import { UseDataStoreActionOptions } from './shared/types';
export interface UseDataStoreCreateActionOptions<Model extends PersistentModel> extends UseDataStoreActionOptions<Model> {
}
/**
 * Action to Create DataStore item
 * @internal
 */
export declare const useDataStoreCreateAction: <Model extends Readonly<Record<string, any>>>({ model, fields: initialFields, schema, }: UseDataStoreCreateActionOptions<Model>) => (() => Promise<void>);
