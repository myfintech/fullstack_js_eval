const structure = [{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'id',
  default_value: 'nextval(\'addresses_id_seq\'::regclass)',
  data_type: 'bigint',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'person_id',
  default_value: null,
  data_type: 'bigint',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'line1',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'line2',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'city',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'state',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'zip',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'created_at',
  default_value: 'now()',
  data_type: 'timestamp with time zone',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'updated_at',
  default_value: null,
  data_type: 'timestamp with time zone',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'addresses',
  column_name: 'deleted_at',
  default_value: null,
  data_type: 'timestamp with time zone',
  column_length: null
}]

const foreignKey = { constraint_catalog: 'mantl',
  constraint_schema: 'public',
  constraint_name: 'addresses_person_id_fkey',
  table_catalog: 'mantl',
  table_schema: 'public',
  table_name: 'addresses',
  constraint_type: 'FOREIGN KEY',
  is_deferrable: 'NO',
  initially_deferred: 'NO' }

module.exports = {
  structure,
  foreignKey
}
