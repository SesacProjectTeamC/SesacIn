INSERT INTO user VALUES
	('1', '87awjkdf', '성춘향', 'test1@test.com', '1', '영등포', '2023-09-08 00:00:00', '2023-09-08 00:00:00'),
    ('2', 'qxur8sda', '변사또', 'test2@test.com', '1', '영등포', '2023-09-08 00:00:00', '2023-09-08 00:00:00'),
    ('3', 'jk48fn4', '한조', 'test3@test.com', '0', '금천',  '2023-09-08 00:00:00', '2023-09-08 00:00:00'),
    ('4', '38ewifh3', '위도우', 'test4@test.com', '1', '중구', '2023-09-08 00:00:00', '2023-09-08 00:00:00'),
    ('5', 'k3f3ah', '송하나', 'test5@test.com', '0', '종로',  '2023-09-08 00:00:00', '2023-09-08 00:00:00'),
    ('6', '4ifha7f', '정크랫',  'test@test.com', '1', '동대문',  '2023-09-08 00:00:00', '2023-09-08 00:00:00');
    
    
INSERT INTO question VALUES
	( '1','질문1', '궁금해요1', '12','1',   '웹', '2023-09-08 00:00:00', '2023-09-08 00:00:00', '1'),
    ( '2','질문2', '궁금해요2', '23', '2', 'AI', '2023-09-08 00:00:00', '2023-09-08 00:00:00','2'),
    ( '3','질문3', '궁금해요3', '35', '5', 'ios', '2023-09-08 00:00:00', '2023-09-08 00:00:00','3'),
    ( '4','질문4', '궁금해요4', '5','0', '웹', '2023-09-08 00:00:00', '2023-09-08 00:00:00','4'),
    ( '5','질문5', '궁금해요5', '54',  '20', 'ios', '2023-09-08 00:00:00', '2023-09-08 00:00:00','5'),
    ( '6','질문6', '궁금해요6', '46',   '10','데이터', '2023-09-08 00:00:00', '2023-09-08 00:00:00','6');
    
  -- upadate set DATE_FORMAT(createdAt, '%a %b %d %Y') AS createdAt FROM question;
    
    INSERT INTO answer VALUES
	( '1','답변제목1', '답변내용1', '3','2023-09-08 00:00:00', '2023-09-08 00:00:00',  '1', '1'),
    ( '2','답변제목2', '답변내용2', '2', '2023-09-08 00:00:00', '2023-09-08 00:00:00','2', '1'),
    ( '3','답변제목3', '답변내용3', '2', '2023-09-08 00:00:00', '2023-09-08 00:00:00', '3', '3'),
    ( '4','답변제목4', '답변내용4', '10','2023-09-08 00:00:00', '2023-09-08 00:00:00', '4', '4'),
	('5','답변제목5', '답변내용5', '2','2023-09-08 00:00:00', '2023-09-08 00:00:00', '5', '5'),
	( '6','답변제목6', '답변내용6', '8', '2023-09-08 00:00:00', '2023-09-08 00:00:00', '6', '6');

    
    
INSERT INTO board VALUES
	( '1','자유게시글1', '내용1', '15','1',  '2023-09-08 00:00:00', '2023-09-08 00:00:00', '1'),
    ( '2','자유게시글2', '내용2', '24', '5', '2023-09-08 00:00:00', '2023-09-08 00:00:00','2'),
    ( '3','자유게시글3', '내용3', '43', '20',  '2023-09-08 00:00:00', '2023-09-08 00:00:00','3'),
    ( '4','자유게시글4', '내용4', '41','15',  '2023-09-08 00:00:00', '2023-09-08 00:00:00','4'),
    ( '5','자유게시글5', '내용5', '55',  '30', '2023-09-08 00:00:00', '2023-09-08 00:00:00','5'),
    ( '6','자유게시글6', '내용6', '16',   '4', '2023-09-08 00:00:00', '2023-09-08 00:00:00','6');
    

    
INSERT INTO comment VALUES
	( '1','질문1 답변1 댓글1','2023-09-08 00:00:00', '2023-09-08 00:00:00', '1', '1', '1', null),
    ( '2','질문1 답변2 댓글2',  '2023-09-08 00:00:00', '2023-09-08 00:00:00', '2', '1', '1', null),
    ( '3','자유1 댓글3',  '2023-09-08 00:00:00', '2023-09-08 00:00:00', '3', null, null, '1'),
    ( '4','자유1 댓글4', '2023-09-08 00:00:00', '2023-09-08 00:00:00', '4', null, null, '1'),
	( '5','질문2 답변3 댓글5', '2023-09-08 00:00:00', '2023-09-08 00:00:00', '5', '3', '3', null),
	( '6','자유2 댓글6',  '2023-09-08 00:00:00', '2023-09-08 00:00:00', '6', null, null, '2');

-- test용 데이터 지우기
-- truncate table uLike;
    
-- left join
-- 질문과 답변 연결 (제목, 내용)

-- SELECT q.*, a.title AS answer_title, a.content AS answer_content
-- FROM question q
-- LEFT JOIN answer a ON q.uId = a.uId;
   
-- 외래키 무시
-- set foreign_key_checks = 0;
    
use sesacin;