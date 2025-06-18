import { ModelInit, PersistentModel, PersistentModelMetaData, Schema } from '@aws-amplify/datastore';
import { DataStoreActionFields } from './types';
interface UseTypeCastFieldsProps<Model extends PersistentModel> {
    fields: DataStoreActionFields<Model>;
    modelName: string;
    schema?: Schema;
}
type UseTypeCastFieldsReturn<Model extends PersistentModel> = ModelInit<Model, PersistentModelMetaData<Model>>;
/**
 * Optimistically casts field string values to types required by
 * datastore based on the schema type
 * @see: See https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
 */
export declare const useTypeCastFields: <Model extends Readonly<Record<string, any>>>({ fields, modelName, schema, }: UseTypeCastFieldsProps<Model>) => UseTypeCastFieldsReturn<Model>;
export {};
