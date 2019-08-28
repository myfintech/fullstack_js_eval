module.exports = [{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'id',
  default_value: 'nextval(\'people_id_seq\'::regclass)',
  data_type: 'bigint',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'first_name',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'last_name',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'birthday',
  default_value: null,
  data_type: 'date',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'company',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'title',
  default_value: null,
  data_type: 'character varying',
  column_length: 256
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'created_at',
  default_value: 'now()',
  data_type: 'timestamp with time zone',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'updated_at',
  default_value: null,
  data_type: 'timestamp with time zone',
  column_length: null
},
{
  database_name: 'mantl',
  table_name: 'people',
  column_name: 'deleted_at',
  default_value: null,
  data_type: 'timestamp with time zone',
  column_length: null
}]
