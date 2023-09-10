let editor;

ClassicEditor.create(document.querySelector("#editor"), {
    placeholder: "내용을 입력하세요",
})
    .then((newEditor) => {
        editor = newEditor;
    })
    .catch((error) => {
        console.error(error);
    });

const temp = () => {
    const data = editor.getData();
    console.log(data);
};

const temp2 = () => {
    editor.setData("<p>Some text.</p>");
};

const postBoard = () => {
    const title = document.querySelector("#title");
    const content = editor.getData();
    const type = "front";
    if (title.value === "" || !title.value) {
        appendAlert("제목을 입력해 주세요");
    } else if (content === "" || !content) {
        appendAlert("내용을 입력해 주세요");
    } else {
        axios({
            method: "POST",
            url: "/question/create",
            data: { title: title.value, content: content, qType: type },
        }).then((res) => {
            if (res) {
                console.log(res.data.result.qId);
                document.location.href = `/question/${res.data.result.qId}`;
            }
        });
    }
};

const alertPlaceholder = document.querySelector("#alertC");
const appendAlert = (message) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div style="display: none" id="myAlert" class="alert alert-danger alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
    $("#myAlert").fadeIn();
};
