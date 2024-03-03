import { loadAuthToken } from '@/util/apiClient';
import { setHtmlHeader } from '@/util/appInitHtml';

//initialize stuff before Vue creates app
loadAuthToken();
setHtmlHeader();