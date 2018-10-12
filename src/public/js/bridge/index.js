import Interactive from './interactive';

import user from './modules/user';
import link from './modules/link';
import dialog from './modules/dialog';

const interactive = new Interactive({
  modules: {
    user,
    link,
    dialog
  }
});

export default interactive;
