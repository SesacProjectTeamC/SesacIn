const { Board } = require('../models/index');
const { Op } = require('sequelize');

// 게시글 전체 조회
exports.getBoardList = async (req, res) => {
  try {
    const BoardList = await Board.findAll();
    res.send(BoardList);
  } catch (error) {
    console.error(error);
    res.send('Internal Server Error');
  }
};

// 게시글 개별 조회
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
