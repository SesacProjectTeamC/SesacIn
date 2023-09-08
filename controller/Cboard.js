const { Board } = require('../models/index');
const { Op } = require('sequelize');

exports.getBoardList = async (req, res) => {
  try {
    const BoardList = await Board.findAll();
    res.send(BoardList);
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error');
  }
};

exports.getBoard = async (req, res) => {
  try {
    const { bId } = req.params;
    const board = await Board.findOne({
      where: { bId: bId },
    });
    res.send(board);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
};
