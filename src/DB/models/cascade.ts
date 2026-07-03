import mongoose, { Query, Model, HydratedDocument } from 'mongoose';

interface IParanoidDocument {
  _id: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  paranoid?: number | boolean | string;
}

export const createCascadeDeleteHook = <T extends IParanoidDocument>(
  childModel: Model<T> | string,
  foreignKeyField: string
) => {
  return async function (this: Query<T[], T>) {
    const filter = this.getFilter() as Record<string, unknown>;
    const paranoidValue = filter.paranoid;

    const isParanoid =
      paranoidValue === 1 ||
      paranoidValue === '1' ||
      paranoidValue === true ||
      paranoidValue === 'true';

    const child =
      typeof childModel === 'string'
        ? mongoose.model(childModel)
        : childModel;

    const documentsToDelete = await this.model.find({
      ...filter,
      deletedAt: isParanoid ? null : { $exists: true },
    });

    if (documentsToDelete.length > 0) {
      const idsToDelete = documentsToDelete.map((doc) => doc._id);

      if (isParanoid) {
        await child.updateMany(
          { [foreignKeyField]: { $in: idsToDelete } },
          { $set: { deletedAt: new Date() } }
        );
      } else {
        await child.deleteMany({
          [foreignKeyField]: { $in: idsToDelete },
        });
      }
    }
  };
};


export const createParanoidDeleteHook = () => {
  return async function (this: Query<HydratedDocument<IParanoidDocument>[], IParanoidDocument>) {
    const filter = this.getFilter() as Record<string, unknown>;
    const paranoidValue = filter.paranoid;

    const isParanoid =
      paranoidValue === 1 ||
      paranoidValue === '1' ||
      paranoidValue === true ||
      paranoidValue === 'true';

    delete filter.paranoid;

    if (!isParanoid) {
      return;
    }

    await this.model.updateMany(
      {
        ...filter,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      }
    );


    this.setQuery({
      _id: { $exists: false },
    });
  };
};

export const createParanoidFindHook = () => {
  return function (this: Query<HydratedDocument<IParanoidDocument>[], IParanoidDocument>) {
    const filter = this.getFilter() as Record<string, unknown>;
    const paranoidValue = filter.paranoid;

    const isParanoid =
      paranoidValue === 1 ||
      paranoidValue === '1' ||
      paranoidValue === true ||
      paranoidValue === 'true';

    delete filter.paranoid;

    
    if (isParanoid && filter.deletedAt === undefined) {
      this.where({ deletedAt: null });
      this.select('-deletedAt');
    }
  };
};