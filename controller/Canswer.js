const { Answer } = require('../models');

// 답변 목록 가져오기
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll();
    res.send(answers);
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 답변 올리기
exports.postAnswer = async (req, res) => {
  try {
    const { aId, content, uId, qId } = req.body;
    const newAnswer = await Answer.create({
      aId,
      content,
      uId,
      qId,
    });
    // res.send(newAnswer);
    // req.params {
    //   content : " "
    // }

    if (newAnswer) {
      return res.send({ result: true, content: newAnswer.content });
    } else {
      return res.send({ result: false });
    }
    // res.body {성공여부}
  } catch (err) {
    console.error(err);
    res.send('Internal Server Error');
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
      }
    );

    if (updatedAnswer) {
      return res.send({ result: true });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};

// 답변 삭제하기
exports.deleteAnswer = async (req, res) => {
  try {
    const { aId } = req.params;

    const isDeleted = await Answer.destroy({
      where: { aId },
    });

    console.log('isDeleted >>>', isDeleted); // 성공 시 1, 실패 시 0

    if (isDeleted) {
      return res.send({ result: true, aId });
    } else {
      return res.send({ result: false });
    }
  } catch (err) {
    console.log(err);
    res.send('Internet Server Error!!!');
  }
};
