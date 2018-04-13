
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('groups', function(table) {
      table.increments('group_id').primary();
      table.string('name');
      table.string('description');
      table.integer('public').unsigned().notNullable(); // Boolean. 1 = true
      table.integer('direct').unsigned().notNullable(); // Direct message or channel? What's the differene? Direct = 1. Channel = 0.
    }),
  ]); 
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('groups'),
  ]);
};
