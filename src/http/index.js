import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 20000
});
// post请求列表
const post = {
    // 登录接口
    login(params, callback) {
        return instance.post('login', params).then(data => {
            callback(data)
        })
    },
    // 添加用户接口
    addusers(params, callback) {
        return instance.post('users', params).then(data => {
            callback(data)
        })
    },
};
// get请求列表
const get = {
    // 拉取菜单
    getMeunList(callback) {
        return instance.get('menus').then(data => {
            callback(data)
        })
    },
    // 拉取用户数据列表
    getqueryInfo(params, callback) {
        return instance.get('users', params).then(data => {
            callback(data)
        })
    },
    // 拉取ID的用户数据
    getuserIdData(params, callback) {
        return instance.get('users/' + params).then(data => {
            callback(data)
        })
    },

};


// put 请求列表changuserdata
const put = {
    // 更改用户状态
    Userstatus(params, callback) {
        return instance.put(`users/${params.userId}/state/${params.Status}`).then(data => {
            callback(data)
        })
    },
    // 更改用户数据
    changuserdata(params, callback) {
        const { id } = params;
        const { email, mobile } = params;
        return instance.put(`users/${id}`, { email, mobile }).then(data => {
            callback(data)
        })
    },

};


// delete请求列表
const Delete = {

    // 删除用户接口
    deleteUser(params, callback){
        console.log(params);
        return instance.delete(`users/${params}`).then(data => {
            callback(data)
        })
    }
}

// 挂载axios拦截器
instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // console.dir(config.headers.Authorization);
    return config
});



export default {
    get(fnName, params, callback) {
        get[fnName](params, callback)
    },
    post(fnName, params, callback) {
        post[fnName](params, callback);
    },
    put(funName, params, callback) {
        put[funName](params, callback)
    },
    delete(funName, params, callback){
        Delete[funName](params, callback);
    }
};
