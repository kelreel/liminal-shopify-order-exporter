/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
import combineRouters from 'koa-combine-routers';
import customersDataRequest from './gdpr/customersDataRequest';
import customersRedact from './gdpr/customersRedact';
import shopRedact from './gdpr/shopRedact';
import isSessionActiveRoute from './isSessionActive';
import ordersRoute from './orders/orders';
import orderCountRoute from './orders/orderCount';
import profilesRoute from './profiles/profiles';

const userRoutes = combineRouters(
  customersDataRequest,
  customersRedact,
  shopRedact,
  ordersRoute,
  profilesRoute,
  orderCountRoute,
  isSessionActiveRoute
);

export default userRoutes;
