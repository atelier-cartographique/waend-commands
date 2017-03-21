/*
 * app/lib/commands/index.js
 *
 *
 * Copyright (C) 2015  Pierre Marchand <pierremarc07@gmail.com>
 *
 * License in LICENSE file at the root of the repository.
 *
 */

/**
 * Here we re-export everything
 */

export { command as attach } from './attach';
export { command as changeContext } from './changeContext';
// export close from './close';
export { command as create } from './new';
// export delAttribute from './delAttribute';
// export delFeature from './delFeature';
// export detach from './detach';
// export echo from './echo';
// export filter from './filter';
export { command as getAttribute } from './getAttribute';
export { command as list } from './list';
// export listCommands from './listCommands';
export { command as login } from './login';
// export logout from './logout';
export { command as lookup } from './lookup';
// export media from './media';
// export notify from './notify';
// export pan from './pan';
export { command as printCurrentContext } from './printCurrentContext';
// export read from './read';
export {
    setRegionCmd as setRegion,
    getRegionCmd as getRegion,
    popRegionCmd as popRegion,
    getCenterCmd as getRegionCenter,
    printRegionCmd as printRegion,
    bufferRegionCmd as bufferRegion
} from './region';
// export select from './select';
export { command as setAttribute } from './setAttribute';
// export zoom from './zoom';





