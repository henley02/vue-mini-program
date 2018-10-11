import Interactive from './interactive';

import user from './modules/user';
import link from './modules/link';

const interactive = new Interactive({
  modules: {
    user,
    link
  }
});

export default interactive;
