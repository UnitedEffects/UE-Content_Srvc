import Images from './model/images';
import tools from '../../apiTools';

const send = tools.send;

export default {
    async addImage(data) {
        const options = data;
        options.slug = options.name.trim().toLowerCase().replace(/ /g, '_').replace(/\./g, '')
            .replace(/!/g, '')
            .replace(/\?/g, '')
            .replace(/{/g, '')
            .replace(/}/g, '');
        const image = new Images(options);
        return send.set200(await image.save(), 'Image');
    }
};
