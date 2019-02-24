import uuid from 'uuidv4';
import Content from './model/content';
import tools from '../../apiTools';

const send = tools.send;

export default {
    async create(data) {
        const options = data;
        options.guid = uuid();
        options.slug = `${options.guid}-${options.title.trim().toLowerCase().replace(/ /g, '_').replace(/\./g, '')}`
            .replace(/!/g, '')
            .replace(/\?/g, '')
            .replace(/{/g, '')
            .replace(/}/g, '');
        const content = new Content(options);
        return send.set200(await content.save(), 'Content');
    },
    async returnAll(product, domain) {
        const query = {};
        if (product) query.product = product;
        if (domain) query.domain = domain;
        return send.set200(await Content.find(query));
    }
};
