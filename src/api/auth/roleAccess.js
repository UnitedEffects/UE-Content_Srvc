import Access from 'accesscontrol';

const ac = new Access();

ac.grant(['guest'])
    .createAny('content')
    .readAny('content')
    .updateOwn('content')
    .deleteOwn('content')
    .readAny('img')
    .readAny('image')
    .readAny('images')
    .createAny('image')
    .updateOwn('image')
    .deleteOwn('image');

ac.grant(['productAdmin', 'domainAdmin'])
    .extend('guest')
    .updateAny('content')
    .deleteAny('content')
    .updateAny('image')
    .deleteAny('image');

ac.grant(['superAdmin'])
    .extend('productAdmin')
    .createAny('logs')
    .updateAny('logs')
    .readAny('logs')
    .deleteAny('logs');

export default ac;