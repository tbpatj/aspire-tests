export const setSVGNoteColor = (svg: any, color: string) => {
  const childExplorer = svg?.children?.[0]?.children;
  for (let i = 0; i < childExplorer.length; i++) {
    const editSvg = childExplorer[i]?.children?.[0];
    if (editSvg) {
      editSvg.style.stroke = color; // stem
      editSvg.style.fill = color; // notehead
    }
  }
};
