function addComment(bId) {
  const comment = document.querySelector('.form-control');

  axios({
    method: 'post',
    url: `/board/comment/create/${bId}`, //bId가 params로 넘어갑니다.
    data: {
      bId,
      content: comment.value,
    },
  })
    .then((response) => {
      // 성공했을때 처리.
      // response.status에 의해서 판단한다.
      console.log(response.data);
      if (response.data.success) {
        document.location.href = `/board/detail/${bId}`;
      }
      // 새로운 댓글 엘리먼트 생성 및 추가
      //   const commentsContainer = document.getElementById('commentsContainer');
      //   const newComment = response.data.commentData; // 새로운 댓글 데이터

      //   const commentDiv = document.createElement('div');
      //   commentDiv.innerHTML = `
      //   ${newComment.cId}. 댓글 작성자: ${newComment.uId}
      //   <button
      //     type="button"
      //     onclick="editComment('${newComment.cId}')"
      //   >
      //     수정하기
      //   </button>
      //   <button
      //     type="button"
      //     onclick="deleteComment('${newComment.cId}')"
      //   >
      //     삭제하기
      //   </button>
      // </div>
      // <div id="comment${newComment.cId}">
      //   ${newComment.cId}. 댓글 내용: ${newComment.content}
      // </div>
      // <div id="editComment${newComment.cId}" style="display: none">
      //   <input
      //     type="text"
      //     id="editedComment${newComment.cId}"
      //     value="${newComment.cId}"
      //   />
      //   <button
      //     type="button"
      //     onclick="applyEdit('${newComment.cId}')"
      //   >
      //     적용
      //   </button>
      //   <button type="button" onclick="cancelEdit('${newComment.cId}')">취소</button>
      // </div>`;

      //   commentsContainer.appendChild(commentDiv);
    })
    .catch((error) => {
      // 실패했을때 처리
      // response.status에 의해서 판단되어 catch 문에서 실행된다.

      // 에러 객체 전체
      console.log(error);
    });
}
