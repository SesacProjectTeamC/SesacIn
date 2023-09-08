const { Question } = require("../models");

// ("req.params { uId }");

// res.body
// {
//   ""uId"": ""hjj"",
//   ""pw"": ""1"",
//   ""uName"": ""hj"",
//   ""email"": ""jin@gmail.com"",
//   ""isSesac"": true,
//   ""campus"": ""영등포"",
//   ""createdAt"": ""2023-09-08T07:55:46.000Z"",
//   ""updatedAt"": ""2023-09-08T07:55:46.000Z""
//   ""answerData"": {
//       {
//           uName: ""ff"",
//           content: ""에라모르겠다""
//           createdAt: ""2023-09-08T07:55:46.000Z"",
//           likeCount: 5
//       },
//       {
//           uName: ""ff"",
//           content: ""에라모르겠다""
//           createdAt: ""2023-09-08T07:55:46.000Z"",
//           likeCount: 5
//       },
//    }
// }

// 답변 목록 가져오기
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Question.findAll();
    res.send(answers);
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 답변 올리기
exports.postAnswer = async (req, res) => {
  try {
    const { aId, content, likeCount, uId, qId } = req.body;
    const newAnswer = await Answer.create({
      aId,
      content,
      likeCount,
      uId,
      qId,
    });
    res.send(newAnswer);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error");
  }
};

// 답변 수정하기
exports.patchAnswer = async (req, res) => {
  try {
    const { aId } = req.params;
    const { content } = req.body;

    const updatedAnswer = await Answer.update(
      { content },
      {
        where: { aId },
      },
    );

    res.send(updatedAnswer);
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};

// 답변 삭제하기
exports.deleteAnswer = async (req, res) => {
  try {
    const { aId } = req.params;

    const isDeleted = await Answer.destroy({
      where: { aId },
    });

    console.log("isDeleted >>>", isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send("Internet Server Error!!!");
  }
};
