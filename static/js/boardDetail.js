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

const fixComment = (cId, bId) => {
  document.querySelector(`#fixCommentC${cId}`).style.display = 'none';
  const commentContent = document.querySelector(`#comment${cId}`);
  const beforeC = commentContent.innerHTML;
  commentContent.innerHTML = `<textarea autofocus id="fixC" class="form-control aria-label="With textarea" style="height: 80px"">${beforeC.trim()}</textarea>`;
  commentContent.innerHTML += [
    '<div style="display: flex; justify-content: flex-end; color: darkgray; margin-top: 10px">',
    `<div class="cancelBtn" onclick="fixCancel('${beforeC.trim()}', '${cId}');">취소</div>`,
    `<div style="cursor: pointer" onclick="fixFinish('${cId}', '${bId}');">완료</div>`,
    '</div>',
  ].join('');
};

const fixCancel = (content, cId) => {
  const commentContent = document.querySelector(`#comment${cId}`);
  commentContent.innerHTML = content;
  document.querySelector(`#fixCommentC${cId}`).style.display = 'flex';
};

const fixFinish = (cId, bId) => {
  const commentContent = document.querySelector('#fixC').innerHTML;
  axios({
    method: 'patch',
    url: `/board/comment/edit/${cId}`,
    data: {
      content: commentContent,
    },
  })
    .then((response) => {
      document.location.href = `/board/detail/${bId}`;
    })
    .catch((error) => {
      console.log(error);
    });
};

function deleteComment(cId, bId) {
  // 댓글 삭제 요청을 서버로 보내고, 성공하면 화면에서 삭제
  axios({
    method: 'delete',
    url: `/board/comment/delete/${cId}`,
  })
    .then((response) => {
      console.log(response.data);
      document.location.href = `/board/detail/${bId}`;
      // refreshComments(); // 댓글 목록 업데이트
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
}

const deletePost = (bId) => {
  axios({
    method: 'delete',
    url: `/board/delete/${bId}`,
  })
    .then((response) => {
      document.location.href = `/`;
      // refreshComments(); // 댓글 목록 업데이트
    })
    .catch((error) => {
      console.error(error.message);
      console.error(error.response.data.msg);
    });
};

const openModal = (msg, func) => {
  const confirmBtn = document.querySelector('#deletebtn');
  document.querySelector('#cautionText').innerHTML = msg;
  confirmBtn.setAttribute('onClick', func);
  $('#myModal').modal('show');
};

const closeModal = () => {
  $('#myModal').modal('close');
};
