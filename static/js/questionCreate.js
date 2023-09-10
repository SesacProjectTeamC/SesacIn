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
};
