const { Board } = require("../models/index");

// 자유게시판 전체 조회
exports.getBoardList = async (req, res) => {
  try {
    const BoardList = await Board.findAll();
    res.render("index", { type: "board", data: BoardList });
  } catch (error) {
    console.error(error);
    res.send("Internal Server Error");
  }
};

// 자유게시판 개별 조회
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
