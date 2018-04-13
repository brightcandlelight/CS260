exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tweets', function(table) {
      table.increments('id').primary();
      table.string('tweet');
      table.dateTime('created');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
      table.integer('group_id').unsigned();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tweets'),
  ]);
};
