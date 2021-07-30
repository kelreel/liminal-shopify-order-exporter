import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import Shopify from '@shopify/shopify-api';
const triggerOauth = new Router();

triggerOauth.get('/oauth', async (ctx) => {
  // redirect to auth
  const shop = process.env.SHOP;
  ctx.redirect(`/auth?shop=${shop}`);
});

export default triggerOauth;
