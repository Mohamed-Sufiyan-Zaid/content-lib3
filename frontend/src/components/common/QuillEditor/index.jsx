import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's stylesheet

function QuillEditor({ placeholder = "Enter document data here", editorHtml, setEditorHtml }) {
  const handleChange = (html) => {
    setEditorHtml(html);
  };
  return (
    <div>
      <ReactQuill
        theme="snow"
        onChange={handleChange}
        value={editorHtml}
        modules={QuillEditor.modules}
        formats={QuillEditor.formats}
        bounds=".app"
        placeholder={placeholder}
      />
    </div>
  );
}

QuillEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

QuillEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video"
];

export default QuillEditor;
