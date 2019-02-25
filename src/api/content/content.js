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
    async returnAll(q) {
        const query = q
        if (query.search) {
            query.$text = { $search: query.search };
            delete query.search;
        }
        return send.set200(await Content.find(query));
    },
    async _getOne(lookup) {
        const query = lookup;
        let content = await Content.findOne(query);
        if (!content) {
            query.slug = query.guid;
            delete query.guid;
            content = await Content.findOne(query);
        }
        if (!content) throw send.fail404(query);
        return content.toObject();
    },
    async patchOne(q, update) {
        const query = q;
        let updated = await Content.findOneAndUpdate(query, update, { new: true });
        if (!updated) {
            query.slug = query.guid;
            delete query.guid;
            updated = await Content.findOneAndUpdate(query, update, { new: true });
        }
        if (!updated) throw send.fail404(query);
        return send.set200(updated, 'Content');
    },
    async deleteOne(query) {
        const updated = await Content.findOneAndRemove(query);
        if (!updated) throw send.fail404(query);
        return send.set200(updated, 'Content');
    }
};
