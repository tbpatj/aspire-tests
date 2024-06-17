// import Essentia from "essentia.js/dist/essentia.js-core.es";
import Essentia from "essentia.js/dist/essentia.js-extractor.es";

import { EssentiaWASM } from "essentia.js/dist/essentia-wasm.es";

const essentia = new Essentia(EssentiaWASM);

export default essentia;
