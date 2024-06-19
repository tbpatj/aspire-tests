import { Note, OpenSheetMusicDisplay, VoiceEntry } from "opensheetmusicdisplay";
import { initPixi } from "./pixi/pixiInstance";
import { convertMusicXML } from "./utils/musicxaml";

document.addEventListener("DOMContentLoaded", (event) => {
  const main = async () => {
    // initPixi();
    // console.log(musicXmlUrl);
    // const response = await fetch("public/musicxml/chant/Chant.musicxml");
    // const musicXml = await response.text();
    // console.log(musicXml);
    // convertMusicXML(musicXml);
    let osmd = new OpenSheetMusicDisplay("music-container");

    const setCursorNoteGreen = () => {
      for (
        let i = 0;
        i < osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes.length;
        i++
      ) {
        const notes = osmd.cursor?.GNotesUnderCursor()?.[0];
        const staves = osmd.cursor?.GNotesUnderCursor();
        console.log(staves);
        //@ts-ignore
        const svgEl = notes?.getSVGGElement();
        //@ts-ignore
        const svgEl2 = svgEl?.children?.[0]?.children?.[0]?.children?.[0];
        const svgEl3 = svgEl?.children?.[0]?.children?.[1]?.children?.[0];
        if (svgEl2) {
          svgEl2.style.stroke = "#FF0000"; // stem
          svgEl2.style.fill = "#FF0000"; // notehead
        }
        if (svgEl3) {
          svgEl3.style.stroke = "#FF0000"; // stem
          svgEl3.style.fill = "#FF0000"; // notehead
        }
        // try {
        //   const mI = osmd.Cursor.Iterator.CurrentMeasureIndex;
        //   console.log(osmd.Cursor);
        //   const graphicalNote =
        //     osmd.GraphicSheet.MeasureList[mI][0].staffEntries[1]
        //       .graphicalVoiceEntries[0].notes[0];
        //   // console.log(graphicalNote);
        //   // console.log(graphicalNote.getSVGGElement());
        //   //@ts-ignore
        //   const ele = graphicalNote.getSVGGElement();
        //   const ele2 = ele.children[0].children[0].children[0];
        //   // console.log(ele2.style.fill);
        //   // console.log(ele2);
        //   ele2.style.fill = "#FF0000";
        //   ele2.style.stroke = "#FF0000";
        //   //@ts-ignore
        //   // graphicalNote.getSVGGElement().children[0].children[0].children[0].style.fill =
        //   //   "#FF0000";
        // } catch (e) {
        //   console.log(e);
        // }
        // console.log(osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[i]);
        // osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[i].NoteheadColor =
        //   "green";
        // for (
        //   let t = 0;
        //   t <
        //   //@ts-ignore
        //   osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[0]?.beam?.notes
        //     ?.length;
        //   t++
        // ) {
        //   console.log(
        //     //@ts-ignore
        //     osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[0]?.beam?.notes?.[
        //       t
        //     ]
        //   );
        //   //@ts-ignore
        //   osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[0]?.beam?.notes?.[
        //     t
        //   ].NoteheadColor = "green";
        // }
        osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[i];
      }
    };

    let looping = true;
    let tStart = Date.now();
    let nextElapsed = 0;

    const loop = () => {
      console.log("looping");
      if (Date.now() - tStart > nextElapsed) {
        // osmd.render();
        setCursorNoteGreen();
        osmd.cursor.next();
        const current = osmd.Cursor.iterator.currentTimeStamp.RealValue;
        const t =
          osmd.Cursor.Iterator.CurrentVoiceEntries[0].Notes[0]
            .NoteToGraphicalNoteObjectId;
        // console.log(osmd.Cursor.iterator.currentTimeStamp);
        // console.log(osmd.Cursor.Iterator.CurrentSourceTimestamp);
        // console.log(osmd.Cursor.Iterator.CurrentEnrolledTimestamp);
        // console.log(osmd.Cursor.Iterator.CurrentRelativeInMeasureTimestamp);

        osmd.cursor.next();
        const next = osmd.Cursor.Iterator.currentTimeStamp.RealValue;
        const check = next - current;
        const overdraw = Date.now() - tStart - nextElapsed;
        console.log(check, overdraw);
        nextElapsed = check * 2000;
        tStart = Date.now() - overdraw;
        osmd.cursor.previous();
      }
      if (looping) requestAnimationFrame(loop);
    };

    osmd.setOptions({
      backend: "svg",
      drawTitle: true,
      // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
    });
    osmd.load("/public/musicxml/rhythm_practice.mxl").then(function () {
      osmd.render();
      osmd.cursor.show();
      loop();
    });
  };

  main();
});
