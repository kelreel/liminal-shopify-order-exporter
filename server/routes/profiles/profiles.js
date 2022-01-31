import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { verifyRequest } from 'simple-koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
import ProfileModel from '../../models/ProfileModel';
import ShopModel from '../../models/ShopModel';
import { getShopFromAuthHeader } from '../../../utils/server/getShopFromAuthHeader';
const profilesRoute = new Router();

// shop name for temp debugging/development
const shop = 'test-store-testing-testing-wuddup.myshopify.com';

// GET all profile names only
profilesRoute.get('/api/profiles', async (ctx, next) => {
  // const shop = ctx.query.shop; // being manually set for now at top of file
  try {
    if (!shop) ctx.throw(400, 'Shop query not provided');
    const profiles = await ShopModel.findOne({ shop }, 'profiles').populate('profiles', 'name').exec();
    if (profiles == null) ctx.throw(400, 'Profile not found.');
    ctx.body = profiles;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
});

// GET single profile details
profilesRoute.get('/api/profiles/:id', async (ctx, next) => {
  const shop = ctx.query.shop;
  const { id } = ctx.params;
  try {
    if (!shop || !id) ctx.throw(400, 'Did not receive either shop or id parameter');
    const profile = await ProfileModel.findById(id);
    ctx.body = profile;
  } catch (err) {
    console.log(err);
    ctx.body = err;
  }
});
// POST create a new export profile
profilesRoute.post(
  '/api/profiles/create',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    const body = ctx.request.body;
    if (Object.keys(body).length == 0) ctx.throw(400, 'Invalid body');

    const { profileName } = body;
    try {
      // const shop = getShopFromAuthHeader(ctx);
      if (!shop) ctx.throw(400, 'Couldnt get shop from header');
      if (!profileName) ctx.throw(400, 'profileName was empty');

      const foundShop = await ShopModel.findOne({ shop }).exec();
      if (!foundShop) throw new Error('Couldnt retrieve shop from database');
      await foundShop.addNewProfile(profileName);
      ctx.body = {
        message: 'cool, received it. ',
      };
    } catch (err) {
      console.log(err);
    }
  }
);

// PUT rename export profile
// consider whether or not to use this or just a single all purpose profile update route
profilesRoute.patch(
  '/api/profiles/rename',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    try {
      const { id, newName } = ctx.request.body;
      if (!id || !newName || newName.length == 0) ctx.throw(400, 'Invalid input');

      const profile = await ProfileModel.findById(id).exec();
      profile.name = newName;
      await profile.save();
      ctx.body = {
        message: 'cool, changed the profile name',
      };
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE an export profile
// TODO: Also remove it from the shop that owns it
profilesRoute.delete(
  '/api/profiles/delete',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    try {
      const { id } = ctx.request.body;
      if (!id) ctx.throw(400, 'Invalid input');

      await ProfileModel.findByIdAndDelete(id).exec();
      ctx.body = {
        message: 'cool, deleted it',
      };
    } catch (err) {
      console.log(err);
    }
  }
);
export default profilesRoute;
