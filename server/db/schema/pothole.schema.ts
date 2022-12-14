import sequelize from '../db.server';
import Rating from './ratings.schema';
import {
  Association,
  NonAttribute,
  Model,
  DataTypes,
  CreationOptional,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import PotholeIMG from './potholeImgs.schema';

class Pothole extends Model {
  declare pothole_id: CreationOptional<number>;
  declare fixed: boolean;
  declare lat: number;
  declare lon: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ratings?: NonAttribute<Rating[]>;
  declare potholeimgs?: NonAttribute<PotholeIMG[]>;
  declare createRating: HasManyCreateAssociationMixin<Rating, 'pothole_id'>;
  declare createImg: HasManyCreateAssociationMixin<PotholeIMG, 'pothole_id'>;
  declare static associations: {
    ratings: Association<Pothole, Rating>;
    potholeimgs: Association<Pothole, PotholeIMG>;
  };
}
Pothole.init(
  {
    pothole_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    fixed: {
      type: new DataTypes.BOOLEAN(),
      // allowNull: false,
    },
    lat: {
      type: new DataTypes.FLOAT(),
      allowNull: false,
    },
    lon: {
      type: new DataTypes.FLOAT(),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'potholes',
    sequelize,
  }
);

(async () => {
  await sequelize.sync();
})();

export default Pothole;
