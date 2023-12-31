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
        alert(response.error);
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      resolve({
        default: `${requestUrl}/${response.path}`, //업로드된 파일 주소
      });
    });
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append('file', file);
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
    newEditor.setData(String(document.querySelector('#editContent').textContent.trim()));
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
};

const changeType2 = (t) => {
  const dpLabel = document.querySelector('#dpLabel');
  dpLabel.innerHTML = t;
};

const editBoard = (bId) => {
  const t = document.querySelector('#typeLabel').innerHTML.trim();
  const title = document.querySelector('#title');
  const content = editor.getData(); // 에디터 내부 데이터

  if (title.value === '' || !title.value) {
    appendAlert('제목을 입력해 주세요');
  } else if (content === '' || !content) {
    appendAlert('내용을 입력해 주세요');
  } else {
    if (t === '자유') {
      axios({
        method: 'PATCH',
        url: `/board/edit/${bId}`,
        data: { title: title.value, content: content },
      }).then((res) => {
        if (res) {
          document.location.href = `/board/detail/${bId}`;
        }
      });
    } else {
      const dpLabel = document.querySelector('#dpLabel').innerHTML.trim();

      axios({
        method: 'PATCH',
        url: `/question/${bId}/edit`,
        data: { title: title.value, content: content, qType: dpLabel },
      }).then((res) => {
        if (res) {
          document.location.href = `/question/${bId}`;
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

  window.scrollTo(0, 0);
  $('#myAlert').fadeIn();
};
