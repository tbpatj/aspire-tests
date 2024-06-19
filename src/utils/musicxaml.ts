import * as xml from "xml-js";

export const convertMusicXML = (xmlString: string) => {
  const options: xml.Options.XML2JSON = {
    compact: true,
    spaces: 4,
    nativeType: true,
    instructionHasAttributes: false,
  };

  const t = xml.xml2json(xmlString, options);
  console.log(t);
  let json = JSON.parse(t);
  for (const key in json) {
    console.log(key);
  }
  //   json = simplify(json);
  console.log(json);
};

// function simplify(obj: any): any {
//   if (typeof obj !== "object" || obj === null) {
//     return obj;
//   }

//   if ("_text" in obj) {
//     return obj._text;
//   }

//   for (const key in obj) {
//     obj[key] = simplify(obj[key]);
//   }

//   return obj;
// }
