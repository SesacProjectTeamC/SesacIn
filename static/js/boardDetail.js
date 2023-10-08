const bLikeHandler = (bId) => {
  axios({
    method: 'PATCH',
    url: `/board/detail/like/${bId}`,
  })
    .then((res) => {
      if (res) {
        const cnt = document.querySelector('.likeImg');
        const curImg = cnt.children[0].getAttribute('src');
        cnt.children[1].innerHTML =
          curImg === '/static/svg/heart-fill.svg'
            ? Number(cnt.children[1].innerHTML) - 1
            : Number(cnt.children[1].innerHTML) + 1;
        cnt.children[0].setAttribute(
          'src',
          curImg === '/static/svg/heart-fill.svg'
            ? '/static/svg/heart.svg'
            : '/static/svg/heart-fill.svg'
        );
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        openModal(err.response.data);
      } else {
        openModal('서버오류 발생');
      }
    });
};

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
      if (response.data.success) {
        document.location.href = `/board/detail/${bId}`;
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        openModal(error.response.data);
      } else {
        openModal('서버오류 발생');
      }
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
  const commentContent = document.querySelector('#fixC').value;

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
