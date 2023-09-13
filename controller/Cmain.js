// const { Question, Answer, Comment } = require('../models');

// exports.main = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       isLogin = false
//     }
//     req.session.user ? true : false;

//     // const sampleData = [
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     //   {
//     //     type: '자유',
//     //     time: '2023-01-01',
//     //     name: 'kuromi',
//     //     title: '내가 첫글이야?',
//     //     content: '가나다라마바사아자차카타파하',
//     //   },
//     // ];
//     const questions = await Question.findAll();

//     console.log('isLogin >>>', isLogin);
//     res.render('index', { type: '', data: questions, isLogin: isLogin });
//   } catch (err) {
//     console.log(err);
//     res.send('Internet Server Error!!!');
//   }
// };
