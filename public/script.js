window.onload = () => {
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
    // Implement ShareJS
    const documentName = document.location.pathname.substring(1);
    sharejs.open(documentName, "text", (error, doc) => {
      if (error) {
        console.error("Error opening document:", error);
        return;
      }
      doc.attach_textarea(pad);
      convertTextAreaToMarkdown();
    });
  }

  // Convert on page load
  convertTextAreaToMarkdown();
};
