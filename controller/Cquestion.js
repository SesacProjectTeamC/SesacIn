const { Question } = require('../models');
const { Op } = require('sequelize');

// 질문 목록 가져오기
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.send(questions);
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 질문 가져오기
exports.getQuestion = async (req, res) => {
  try {
    const { qId } = req.params;
    const question = await Question.findOne({
      where: { qId },
    });
    res.send(question);

    console.log('question>>>', question);

    //! 답변 목록 데이터도 함께 가져올 것
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

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

// 질문 올리기
exports.postQuestion = async (req, res) => {
  try {
    const { qId, title, content, viewCount, likeCount, type, uId } = req.body;
    const newQuestion = await Question.create({
      qId,
      title,
      content,
      viewCount,
      likeCount,
      type,
      uId,
    });
    res.send(newQuestion);
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
  }
};

// 질문 수정하기
exports.patchQuestion = async (req, res) => {
  try {
    const { qId } = req.params;
    const { team_id } = req.body;

    const updatedQuestion = await Question.update(
      { team_id: team_id },
      {
        where: { qId },
        // params에 있는 Question_id를 Question_id로 바꾸겠다
      }
    );

    res.send(updatedQuestion);
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 질문 삭제하기
exports.deleteQuestion = async (req, res) => {
  try {
    const { qId } = req.params;

    const isDeleted = await Question.destroy({
      where: { qId: qId },
    });

    console.log('isDeleted >>>', isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
