const { Question, Answer, Comment } = require("../models");

// 특정 질문과 그 질문에 대한 답변 전체 리스트 가져오기
// 특정 답변에 대한 전체 댓글 리스트 가져오기
exports.getQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const question = await Question.findOne({
      where: { qId },
    });

    const answers = await Answer.findAll();

    const comments = await Comment.findAll();

    res.render("question", {
      data: question,
      answerData: answers,
      commentData: comments,
    });
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

//=== JOIN 진행할 경우 추가 예정 ===
// const answers = await Question.findAll({
//   where : {
//     uId === uId,
//   },
//   include: [
//     {model: Answer,
//       required: false,
//     }
//   ]
// });
