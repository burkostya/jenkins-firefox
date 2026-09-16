// PipelineGraph can run without react-zoom-pan-pinch. The extension supplies its
// own scrollable, scaled viewport; null context disables upstream virtualization.
import {createContext} from 'react';
export const Context=createContext(null);
