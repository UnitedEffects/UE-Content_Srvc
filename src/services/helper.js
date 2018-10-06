/**
 * Created by bmotlagh on 10/19/17.
 */

const helper = {
    isJson(check) {
        try {
            JSON.parse(check);
            return true;
        } catch (e) {
            return false;
        }
    }
};

export default helper;
