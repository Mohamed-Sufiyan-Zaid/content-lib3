import { emTagsRegex, placeHolderRegex, htmlTagsRegexGlobal } from "./constants";

export const editPlaceHolderHtmlString = (initialHtml) => {
  const parser = new DOMParser();
  // Delete older em tags
  const newString = initialHtml.replace(emTagsRegex, "");
  const doc = parser.parseFromString(newString, "text/html");
  const paragraphs = doc.querySelectorAll("p");
  paragraphs.forEach((paragraph) => {
    const spanElements = paragraph.querySelectorAll("span");
    spanElements.forEach((span) => {
      const text = span.textContent;
      if (placeHolderRegex.test(text)) {
        const id = placeHolderRegex.exec(text)[1];
        // Replace the placeholder text
        const placeHolderContentForId = document.getElementById(`placeholder-${id}`)?.textContent || "";
        const emTag = document.createElement("em");
        emTag.id = id;
        emTag.setAttribute("data-testid", placeHolderContentForId);
        emTag.textContent = placeHolderContentForId;
        emTag.style.display = "none";
        span.insertAdjacentElement("afterend", emTag);
      }
    });
  });
  const updatedHtmlString = new XMLSerializer().serializeToString(doc).replace(htmlTagsRegexGlobal, "");
  return updatedHtmlString;
};

export const cleanHtmlForDownload = (initialHtml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(initialHtml, "text/html");
  const spanElements = doc.querySelectorAll("span");
  spanElements.forEach((spanEl) => {
    if (placeHolderRegex.test(spanEl.textContent)) {
      spanEl.remove();
    }
  });
  const emTags = doc.querySelectorAll("em");
  emTags.forEach((emTag) => {
    emTag.style.display = "block";
  });
  const updatedHtmlString = new XMLSerializer()
    .serializeToString(doc)
    .replaceAll(htmlTagsRegexGlobal, "")
    .replaceAll("<em", "<p")
    .replaceAll("</em>", "</p>");
  return updatedHtmlString;
};
