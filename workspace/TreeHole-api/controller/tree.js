const { Tree, User } = require("../model");
const { result, err } = require("../util");

const { mergeTrees } = require("../util/merge");

// addTree
const addTree = async (req, res, next) => {
  try {
    const tree = new Tree(req.body);
    const data = await tree.save();
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// removeById
const removeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    let data = await Tree.findByIdAndRemove(_id);
    if (!data) {
      next(err("The tree does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// modifyById
const modifyById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Tree.findByIdAndUpdate(_id, req.body);
    if (!data) {
      next(err("The tree does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeList
const getTreeList = async (req, res, next) => {
  try {
    const { pageNo, limit } = req.body;
    const data = await Tree.find()
      .skip((pageNo - 1) * limit)
      .limit(limit);
    const trees = await mergeTrees(data);
    res.send(result(200, trees, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeById
const getTreeById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const data = await Tree.findOne({ _id });
    if (!data) {
      next(err("The tree does not exist", 403, ""));
      return;
    }
    res.send(result(200, data, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeListByUserID
const getTreeListByUserID = async (req, res, next) => {
  try {
    const { userID, pageNo, limit } = req.body;
    const trees = await Tree.find({ ownerID: userID })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    if (!trees) {
      next(err("The userID does not has trees", 403, ""));
      return;
    }
    const treeList = await mergeTrees(trees);
    res.send(result(200, treeList, "ok"));
  } catch (e) {
    next(err(e));
  }
};

// getTreeListByID
const getTreeListByID = async (req, res, next) => {
  try {
    let { trees, pageNo, limit } = req.body;
    trees = trees.slice((pageNo - 1) * limit, pageNo * limit);
    const data = await Tree.find({ _id: { $in: trees } });
    const treeList = await mergeTrees(data);
    res.send(result(200, treeList, "ok"));
  } catch (e) {
    next(err(e));
  }
};

module.exports = {
  addTree,
  removeById,
  modifyById,
  getTreeById,
  getTreeList,
  getTreeListByUserID,
  getTreeListByID,
};
