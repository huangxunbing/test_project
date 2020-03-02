import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 20000
});

const post = {
    login (params, callback) {
       return instance.post('login', params).then(data => {
            callback(data)
        })
    }
};

export default {
    get (fnName, params, callback) {
    },
    post (fnName, params, callback) {
        post[fnName](params, callback);
    }
};
