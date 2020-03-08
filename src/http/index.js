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
        console.log(params);
        return instance.post('users', params).then(data => {
            callback(data)
        })
    },


    // 角色授权接口
    upRoles(params, callback) {
        return instance.post(`roles/${params.id}/rights`, { rids: params.keysArr }).then(data => {
            callback(data)
        })
    },
    // 添加分类接口
    addCat(params, callback) {
        console.log(params)
        return instance.post('categories',params).then(data => {
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
    // 获取权限列表
    getRightsList1(callback) {
        return instance.get('rights/list').then(data => {
            callback(data)
        })
    },
    // 获取角色列表
    getRoleslist(callback) {
        return instance.get('roles').then(data => {
            callback(data)
        })
    },
    // 获取所有的权限列表
    getRoleslist2(callback) {
        return instance.get('rights/tree').then(data => {
            callback(data)

        })
    },
    // 获取商品列表
    getcateList(params, callback) {
        return instance.get('categories', { params }).then(data => {
            callback(data)
        })
    },
    // 获取商品分类的父级
    getParentCateList(callback) {
        return instance.get('categories', {
            params: {
                type: 2
            }
        }).then(data => {
            callback(data)
        })
    }
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
    // 添加角色
    upRoleUesr(params, callback) {
        const { userId } = params;
        const { newItem } = params;
        return instance.put(`users/${userId}/role`, { rid: newItem }).then(data => {
            callback(data)
        })
    },
};

// delete请求列表
const Delete = {

    // 删除用户接口
    deleteUser(params, callback) {
        return instance.delete(`users/${params}`).then(data => {
            callback(data)
        })
    },

    // 删除指定角色id的指定id权限
    deleteRoles(params, callback) {
        return instance.delete(`roles/${params.id}/rights/${params.Rolesid}`).then(data => {
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
    delete(funName, params, callback) {
        Delete[funName](params, callback);
    }
};
