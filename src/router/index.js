import routerEi from '@/modules/ei/routes/index'
import routerBzr from '@/modules/bzr/routes/index'
import routerZzs from '@/modules/zzs/routes/index'
import routerAdmin from '@/modules/admin/routes/index'

const host = window.location.host;
const parts = host.split('.');
const domainLength = 3; // route1.example.com => domain length = 3
const router = () => {
  let index = routerEi;
  let routes;
  if (host.includes('localhost')) {
    routes = index;
  } else if (host.includes('exportinfo') || host.includes('ei')) {
    routes = routerEi;
  } else if (host.includes('bzrportal') || host.includes('bzr')) {
    routes = routerBzr;
  } else if (host.includes('zzs')) {
    routes = routerZzs;
  } else if (host.includes('actamedia') || host.includes('admin')) {
    routes = routerAdmin;
  } 
  else {
    console.error("Missing new app. App '"+host+"' not defined.");
  }
  return routes;
};
export default router()

