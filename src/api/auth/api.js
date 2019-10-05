import tools from '../../apiTools';
import auth from './auth';
import log from '../log/logs';

const respond = tools.respond;
const config = require('../../config');

export default {
    async middleAny(req, res, next) {
        try {
            const roles = await auth.getRole(req.user, auth.getDomain(req));
            let resource = req.path.split('/')[1];
            if (resource === '') resource = 'root';
            let access = false;
            for (let i = 0; i < roles.length; i++) {
                if (access === false) {
                    access = await auth.checkRole('any', access, roles[i], req.method, resource);
                }
            }
            if (access) return next();
            return respond.sendUnauthorized(res);
        } catch (error) {
            log.error(error);
            return respond.sendUnauthorized(res);
        }
    },
    isBearerAuthenticated: auth.isBearerAuthenticated,
    isOptionalAuthenticated: auth.isOptionalAuthenticated,
    isWebHookAuthorized(req, res, next) {
        if (req.query.code === config.WEBHOOK) return next();
        return respond.sendUnauthorized(res);
    }
};