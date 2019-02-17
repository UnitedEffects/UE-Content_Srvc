import Content from './model/content';
import tools from '../../apiTools';

const send = tools.send;

export default {
    async create(data) {
        const options = data;
        options.slug = options.title.trim().toLowerCase().replace(/ /g, '_').replace(/\./g, '')
            .replace(/!/g, '')
            .replace(/\?/g, '')
            .replace(/{/g, '')
            .replace(/}/g, '');
        const content = new Content(options);
        return send.set200(await content.save(), 'Content');
    }
};
