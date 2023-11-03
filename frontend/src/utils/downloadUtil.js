import wordTemplate from "./exportDocumentTemplate.txt";

export const htmlToElement = async ({ title = "", date = "", time = "", author = "", watermark = "" }, htmlData, element) => {
  const template = document.createElement("template");
  const html = htmlData.trim();

  template.innerHTML = html;
  template.content.getElementById("page-data").innerHTML = element;
  template.content.getElementById("document-title").innerHTML = title;
  template.content.getElementById("publish-date").innerHTML = date;
  template.content.getElementById("publish-time").innerHTML = time;
  template.content.getElementById("author-name").innerHTML = author;
  template.content.getElementById("watermark").innerHTML = watermark;

  return `<html>${template.innerHTML}</html>`;
};

export const exportDocument = async (meta, element, name = "") => {
  let filename = name;
  let templateHtml = await fetch(wordTemplate);
  templateHtml = await templateHtml.text();
  const formattedTemplate = await htmlToElement(meta, templateHtml, element);

  // Specify file name
  filename = filename ? `${filename}.doc` : "document.doc";

  if (navigator.msSaveOrOpenBlob) {
    const blob = new Blob(["\ufeff", formattedTemplate], {
      type: "application/msword"
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create download link element
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    // Create a link to the file
    downloadLink.href = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(formattedTemplate)}`;

    // Setting the file name
    downloadLink.download = filename;

    // triggering the function
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};

export const getDownloadMetaData = (ntId) => {
  const publishDateTime = new Date();
  return {
    title: "Generated Document",
    date: publishDateTime.toLocaleDateString(),
    time: publishDateTime.toLocaleTimeString(),
    author: ntId
  };
};
