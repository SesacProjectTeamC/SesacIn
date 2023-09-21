class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    // 경로 변수화
    const currentUrl = window.location.origin;
    const uploadUrl = `${currentUrl}/upload/editor/file`;
    xhr.open('POST', uploadUrl, true);
    xhr.responseType = 'json';
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = '파일을 업로드 할 수 없습니다.';

    xhr.addEventListener('error', () => {
      reject(genericErrorText);
    });
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      const requestUrl = window.location.origin;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        // response = { "success": true, "msg": "파일이 성공적으로 업로드되었습니다.", url: "http://localhost:8000/static/profileImg/qwodqwo.jpg"}
        default: `${requestUrl}/${response.path}`, //업로드된 파일 주소
      });
    });
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append('file', file);
    console.log(data);
    this.xhr.send(data);
  }
}

let editor;

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new UploadAdapter(loader);
  };
}

ClassicEditor.create(document.querySelector('.editor'), {
  extraPlugins: [MyCustomUploadAdapterPlugin],
  link: {
    defaultProtocol: 'http://',
  },
  placeholder: '내용을 입력해주세요.',
})
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch((error) => {
    console.error(error);
  });

const changeType = (t) => {
  const typeLabel = document.querySelector('#typeLabel');
  typeLabel.innerHTML = t;
  const dpContainer = document.querySelector('#dpContainer');
  dpContainer.style.display = 'flex';
  if (t === '자유') {
    dpContainer.style.display = 'none';
  } else {
    dpContainer.style.display = 'flex';
  }
  // dpContainer = "";
  // if (t !== "자유") {
  //   const front = [
  //     '<div style="display: flex; margin-bottom: 15px; align-items: center">',
  //     '<div class="qcTitle">카테고리</div>',
  //     '<div class="dropdown">',
  //     '<button id="dpLabel" class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">',
  //     "앱 / 웹",
  //     "</button>",
  //     '<ul class="dropdown-menu">',
  //   ].join("");
  //   let middle;
  //   for (d of [
  //     "앱/웹",
  //     "AI",
  //     "빅데이터",
  //     "클라우드",
  //     "핀테크",
  //     "블록체인",
  //     "개임개발",
  //     "기타",
  //   ]) {
  //     middle += [
  //       `<li class="dropdown-item" onclick="changeType2('${d}')">``${d}`,
  //       "</li>",
  //     ].join("");
  //   }
  //   const end = ["</ul>", "</div>", "</div>"].join("");
  //   dpContainer += front;
  //   dpContainer += middle;
  //   dpContainer += end;
  // }
};

const changeType2 = (t) => {
  const dpLabel = document.querySelector('#dpLabel');
  dpLabel.innerHTML = t;
};

const postBoard = () => {
  const t = document.querySelector('#typeLabel').innerHTML.trim();
  const title = document.querySelector('#title');
  const content = editor.getData(); // 에디터 내부 데이터
  console.log(t);
  if (title.value === '' || !title.value) {
    appendAlert('제목을 입력해 주세요');
  } else if (content === '' || !content) {
    appendAlert('내용을 입력해 주세요');
  } else {
    if (t === '자유') {
      axios({
        method: 'POST',
        url: '/board/create',
        data: { title: title.value, content: content },
      }).then((res) => {
        if (res) {
          console.log(res.data.bId);
          document.location.href = `/board/detail/${res.data.bId}`;
        }
      });
    } else {
      const dpLabel = document.querySelector('#dpLabel').innerHTML.trim();
      console.log({ title: title.value, content: content, qType: dpLabel });
      axios({
        method: 'POST',
        url: '/question/create',
        data: { title: title.value, content: content, qType: dpLabel },
      }).then((res) => {
        if (res) {
          console.log(res.data);
          document.location.href = `/question/${res.data.result.qId}`;
        }
      });
    }
  }
};

const alertPlaceholder = document.querySelector('#alertC');
const appendAlert = (message) => {
  alertPlaceholder.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div style="display: none" id="myAlert" class="alert alert-danger alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>',
  ].join('');

  alertPlaceholder.append(wrapper);
  console.log(alertPlaceholder);
  window.scrollTo(0, 0);
  $('#myAlert').fadeIn();
};
