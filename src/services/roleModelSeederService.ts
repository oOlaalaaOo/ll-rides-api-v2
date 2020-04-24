import RoleModel, { IRole } from '../models/roleModel';

const seedRoles = async () => {
  const roles = [
    { name: 'vendor', description: 'vendors' },
    { name: 'customer', description: 'customers' },
    { name: 'admin', description: 'admins' },
  ];

  const roleModel: IRole = new RoleModel();

  return roleModel.collection.insertMany(roles, (err, docs) => {
    if (err) {
      console.error(err);

      return Promise.reject(err);
    } else {
      console.log('Roles bulk save is successful');

      return Promise.resolve(docs);
    }
  });
};

export default {
  seedRoles,
};
