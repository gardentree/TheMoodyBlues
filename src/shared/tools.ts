const decoder = document.createElement("textarea");
export function decodeHTML(html: string): string {
  decoder.innerHTML = html;

  return decoder.value;
}
