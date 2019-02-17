import Access from 'accesscontrol';

const ac = new Access();

ac.grant(['guest'])
    .createAny('payment')
    .createAny('card')
    .readAny('card')
    .updateOwn('card')
    .deleteOwn('card')
    .createOwn('catalog')
    .readAny('catalog')
    .readAny('catalogs')
    .updateOwn('catalog')
    .readAny('my')
    .readAny('featured')
    .readAny('search')
    .readOwn('payment')
    .readAny('favorites')
    .readAny('favorite')
    .createAny('favorite')
    .deleteOwn('favorite');

ac.grant(['productAdmin', 'domainAdmin'])
    .extend('guest')
    .createAny('catalog')
    .createAny('admin')
    .updateAny('admin')
    .readAny('admin')
    .updateAny('catalog')
    .updateAny('card')
    .deleteAny('card')
    .deleteAny('favorite')
    .readAny('payment');

ac.grant(['superAdmin'])
    .extend('productAdmin')
    .deleteAny('admin')
    .deleteAny('catalog')
    .createAny('logs')
    .updateAny('logs')
    .readAny('logs')
    .deleteAny('logs')
    .readAny('payment');

export default ac;