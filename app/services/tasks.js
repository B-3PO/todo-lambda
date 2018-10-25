const db = require('./db');

exports.get = () => db('tasks').orderBy('created_at', 'ASC');

exports.create = async (name) => {
  if (!name) throw Error('requires name');
  return db('tasks')
    .insert({ name })
    .returning('id')
    .into('tasks')
    .then(id => id[0]);
};

exports.delete = async (type, { id }) => {
  if (!id) throw Error('requires args.id');
  return db('tasks')
    .where('id', id)
    .update({ deleted_at: db.raw('CURRENT_TIMESTAMP') });
};
