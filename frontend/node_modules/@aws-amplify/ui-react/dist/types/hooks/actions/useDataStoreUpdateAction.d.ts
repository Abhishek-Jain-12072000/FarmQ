import { IdentifierFieldOrIdentifierObject, PersistentModel, PersistentModelMetaData } from '@aws-amplify/datastore';
import { UseDataStoreActionOptions } from './shared/types';
export interface UseDataStoreUpdateActionOptions<Model extends PersistentModel> extends UseDataStoreActionOptions<Model> {
    id: IdentifierFieldOrIdentifierObject<Model, PersistentModelMetaData<Model>>;
}
/**
 * Action to Update DataStore item
 * @internal
 */
export declare const useDataStoreUpdateAction: <Model extends Readonly<Record<string, any>>>({ fields: initialFields, id, model, schema, }: UseDataStoreUpdateActionOptions<Model>) => (() => Promise<void>);
