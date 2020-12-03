const cubeModule = require('../models/cube');

module.exports = {
  getCubes(req, res, next) {
    const { from, search, to } = req.query;
    let query = {};
    if (search) { query.name = new RegExp(search, 'i'); }
    if (from) {
      query.difficultyLevel = { $gte: +from };
    }
    if (to) {
      query.difficultyLevel = query.difficultyLevel || {};
      query.difficultyLevel.$lte = +to;
    }

    cubeModule.find(query).populate('accessories')
      .then(cubes => {
        res.render('index', { cubes, from, search, to });
      })
      .catch(next);;
  },

  getCube(req, res, next) {
    const id = req.params.id;
    return cubeModule.findById(id).populate('accessories').then(cube => {
      res.render('details', { cube });
    })
      .catch(next);
  },

  getCreateCube(req, res) {
    res.render('create');
  },

  postCreateCube(req, res, next) {
    const { name, description, imageURL, difficultyLevel } = req.body;

    cubeModule.create({ name, description, imageURL, difficultyLevel: +difficultyLevel })
      .then(() => res.redirect('/'))
      .catch(next)
  },

  getEditCube(req, res, next) {
    const id = req.params.id;
    cubeModule.findById(id).then(cube => {
      res.render('edit-cube', cube);
    })
      .catch(next);
  },

  postEditCube(req, res, next) {
    const id = req.params.id;
    const { name, description, difficultyLevel, imageURL } = req.body;
    cubeModule.update({ _id: id }, { name, description, imageURL, difficultyLevel: +difficultyLevel })
      .then(() => res.redirect('/'))
      .catch(next);
  },
  getDeleteCube(req, res, next) {
    const id = req.params.id;
    cubeModule.findById(id).then(cube => {
      res.render('delete-cube', cube);
    })
      .catch(next);
  },

  postDeleteCube(req, res, next) {
    const id = req.params.id;
    cubeModule.deleteOne({ _id: id }).then(() => {
      res.redirect('/');
    }).catch(next);
  },
}

