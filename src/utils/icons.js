import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

// Only add the icons we actually use
library.add(faSearch, faFilter);

export { faSearch, faFilter };
