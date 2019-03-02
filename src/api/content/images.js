import Images from './model/images';
import tools from '../../apiTools';
import Content from "./model/content";


const send = tools.send;

export default {
    async addImage(data) {
        const image = new Images(data);
        return send.set200(await image.save(), 'Image');
    },
    async patchOne(q, update) {
        const updated = await Images.findOneAndUpdate(q, update, { new: true });
        if (!updated) throw send.fail404(q);
        return send.set200(updated, 'Image');
    },
    async deleteOne(query) {
        const updated = await Images.findOneAndRemove(query);
        if (!updated) throw send.fail404(query);
        return send.set200(updated, 'Image');
    },
    async _getOne(lookup) {
        const query = lookup;
        const content = await Images.findOne(query);
        if (!content) throw send.fail404(query);
        return content.toObject();
    },
    async returnAll(q) {
        const query = q
        if (query.search) {
            query.$text = { $search: query.search };
            delete query.search;
        }
        return send.set200(await Images.find(query), 'Images');
    },
};
