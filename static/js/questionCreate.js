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
    xhr.open('POST', 'http://localhost:8000/upload/image/user', true);
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
      console.log(response);
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response.url, //업로드된 파일 주소
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
})
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch((error) => {
    console.error(error);
  });

function temp() {
  const data = editor.getData();
  console.log(data);
}

const temp2 = () => {
  editor.setData('<p>Some text.</p>');
};

const changeType = (t) => {
  const dpLabel = document.querySelector('#dpLabel');
  dpLabel.innerHTML = t;
};

const postBoard = (t) => {
  const title = document.querySelector('#title');
  const content = editor.getData(); // 에디터 내부 데이터
  console.log(content);
  // if (title.value === '' || !title.value) {
  //   appendAlert('제목을 입력해 주세요');
  // } else if (content === '' || !content) {
  //   appendAlert('내용을 입력해 주세요');
  // } else {
  //   if (t === '자유') {
  //     axios({
  //       method: 'POST',
  //       url: '/board/create',
  //       data: { title: title.value, content: content },
  //     }).then((res) => {
  //       if (res) {
  //         console.log(res.data.bId);
  //         document.location.href = `/board/detail/${res.data.bId}`;
  //       }
  //     });
  //   } else {
  //     const dpLabel = document.querySelector('#dpLabel').innerHTML.trim();
  //     console.log({ title: title.value, content: content, qType: dpLabel });
  //     axios({
  //       method: 'POST',
  //       url: '/question/create',
  //       data: { title: title.value, content: content, qType: dpLabel },
  //     }).then((res) => {
  //       if (res) {
  //         console.log(res.data);
  //         document.location.href = `/question/detail/${res.data.result.qId}`;
  //       }
  //     });
  //   }
  // }
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
