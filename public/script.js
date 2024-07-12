window.addEventListener("DOMContentLoaded", () => {
  const converter = new showdown.Converter();
  const pad = document.getElementById("pad");
  const markdownArea = document.getElementById("markdown");

  // Make the tab act like a tab
  pad.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
      // Tab was pressed
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      // Set textarea value to: text before caret + tab + text after caret
      e.target.value = `${value.substring(0, start)}\t${value.substring(end)}`;

      // Put caret at the right position again (add one for the tab)
      e.target.selectionStart = e.target.selectionEnd = start + 1;

      // Prevent the focus lose
      e.preventDefault();
    }
  });

  let previousMarkdownValue;

  // Convert textarea to markdown HTML
  const convertTextAreaToMarkdown = () => {
    const markdownText = pad.value;
    previousMarkdownValue = markdownText;
    const html = converter.makeHtml(markdownText);
    markdownArea.innerHTML = html;
  };

  const didChangeOccur = () => previousMarkdownValue !== pad.value;

  // Check every second if the textarea has changed
  setInterval(() => {
    if (didChangeOccur()) {
      convertTextAreaToMarkdown();
    }
  }, 1000);

  // Convert textarea on input change
  pad.addEventListener("input", convertTextAreaToMarkdown);

  // Ignore if on the home page
  if (document.location.pathname.length > 1) {
    // Implement Yjs
    const documentName = document.location.pathname.substring(1);
    const ydoc = new Y.Doc();
    const provider = new Y.WebsocketProvider(
      "ws://localhost:8000",
      documentName,
      ydoc
    );

    const ytext = ydoc.getText("pad");
    ytext.observe((event) => {
      pad.value = ytext.toString();
      convertTextAreaToMarkdown();
    });

    pad.addEventListener("input", () => {
      ytext.delete(0, ytext.length);
      ytext.insert(0, pad.value);
    });

    // Sync initial content
    pad.value = ytext.toString();
    convertTextAreaToMarkdown();
  }

  // Convert on page load
  convertTextAreaToMarkdown();
});
