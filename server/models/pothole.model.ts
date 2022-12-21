import Pothole from '../db/schema/pothole.schema';
import { Op } from 'sequelize';

export const getAllPotholes = (cb) => {
  Pothole.findAll({})
    .then(data => cb(data))
    .catch(err => console.error('FAILURE TO GET ALL POTHOLES', err));
};

export const getMatchingPotholes = (cb, obj) => {
  Pothole.findAll({
    //determine if there is a pothole that exists between these coordinates
    where: {
      lat: { [Op.between]: [obj.lat - 0.0001, obj.lat + 0.0001] },
      lon: { [Op.between]: [obj.lon - 0.0001, obj.lon + 0.0001] },
    },
  })
    .then(data => cb(data))
    .catch(err => console.log('FAILURE TO MATCH POTHOLE', err))
}

//find a pothole, if it exists send data back - if not create
export const findAndAddPothole = (cb, obj) => {
  Pothole.findAll({
    //determine if there is a pothole that exists between these coordinates
    where: {
      lat: {[Op.between]: [obj.lat - 0.0001, obj.lat + 0.0001]},
      lon: {[Op.between]: [obj.lon - 0.0001, obj.lon + 0.0001]}
    },
  })
    .then((data) => {
      if (data.length === 0) {
        Pothole.create(obj) //create pothole if pothole does not already exist
          .then((data) => {
            cb(data, 'created');
          })
          .catch((err) => console.error('FAILURE TO CREATE POTHOLE', err));
      } else {
        cb(data, 'alreadyExists');
      }
    })
    .catch((err) => console.error('FAILURE TO FIND POTHOLE', err));
};

export default getAllPotholes;
