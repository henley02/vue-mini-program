import Interactive from './interactive';

import user from './modules/user';
import link from './modules/link';
import dialog from './modules/dialog';
import storage from './modules/storage';

const interactive = new Interactive({
  modules: {
    user,
    link,
    dialog,
    storage
  }
});

export default interactive;
