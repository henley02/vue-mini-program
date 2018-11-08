import Interactive from './interactive';

import user from './modules/user';
import link from './modules/link';
import dialog from './modules/dialog';
import storage from './modules/storage';
import system from './modules/system';

const interactive = new Interactive({
  modules: {
    user,
    link,
    dialog,
    storage,
    system
  }
});

export default interactive;
