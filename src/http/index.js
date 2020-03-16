// import Vue from 'vue'
import axios from 'axios';
import nprogress from 'nprogress'

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


    // 角色授权接口
    upRoles(params, callback) {
        return instance.post(`roles/${params.id}/rights`, { rids: params.keysArr }).then(data => {
            callback(data)
        })
    },
    // 添加分类接口addCate
    addCat(params, callback) {
        return instance.post('categories', params).then(data => {
            callback(data)
        })
    },
    // 添加参数
    addParams(params, callback) {
        return instance.post(`categories/${params.id}/attributes`, { 'attr_name': params.attr_name, 'attr_sel': params.attr_sel }).then(data => {
            callback(data)
        })
    },
    // 添加商品接口
    addCateFrom(params, callback) {
        return instance.post('goods', params).then(data => {
            callback(data)
        })
    },
    // 添加角色
    addroles(params, callback) {
        return instance.post('roles', params).then(data => {
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
    },
    // 获取级联菜单数据
    getParamsList(callback) {
        return instance.get('categories').then(data => {
            callback(data)
        })
    },
    // 获取动(静)太值
    getParams(params, callback) {
        return instance.get(`categories/${params.catId}/attributes`, { 'params': { sel: params.selName } }).then(data => {
            callback(data)
        })
    },
    // 根据 ID 查询参数
    getIdData(params, callback) {
        return instance.get(`categories/${params.Id}/attributes/${params.attrId}`, { 'params': { sel: params.attr_sel } }).then(data => {
            callback(data)
        })
    },
    // 获取商品列表
    getGoodsList(params, callback) {
        return instance.get('goods', { params }).then(data => {
            callback(data)
        })
    },
    // 获取商品列表
    getList(callback) {
        return instance.get('categories').then(data => {
            callback(data)
        })
    },
    // 获取商品参数many
    getmanyParams(params, callback) {
        return instance.get(`categories/${params.id}/attributes`, { 'params': { sel: params.sel } }).then(data => {
            callback(data)
        })
    },
    // 获取订单列表
    getOrderList(paramss, callback) {
        return instance.get('orders',{'params':paramss}).then(data => {
            callback(data)
        })
    },
    // 获取物流信息getEacharts
    getlogistics(callback) {
        return instance.get('/kuaidi/804909574412544580').then(data => {
            callback(data)
        })
    },
    // 获取数据报表
    getEacharts(callback) {
        return instance.get('reports/type/1').then(data => {
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
    // 添加角色
    upRoleUesr(params, callback) {
        const { userId } = params;
        const { newItem } = params;
        return instance.put(`users/${userId}/role`, { rid: newItem }).then(data => {
            callback(data)
        })
    },
    // 编辑参数UProles
    editParams(params, callback) {
        return instance.put(`categories/${params.id}/attributes/${params.attr_id}`, { 'attr_sel': params.attr_sel, 'attr_name': params.attr_name }).then(data => {
            callback(data)
        })
    },
    // 
    upParams(params, callback) {
        return instance.put(`categories/${params.Id}/attributes/${params.attrId}`, { 'attr_sel': params.attr_sel, 'attr_name': params.attr_name, 'attr_vals': params.attr_vals }).then(data => {
            callback(data)
        })
    },
    // 更新角色名字或者描述
    UProless(params, callback) {
        return instance.put(`roles/${params.id}`,params).then(data => {
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
    },
    // 删除参数
    deleteParams(params, callback) {
        return instance.delete(`categories/${params.id}/attributes/${params.attrId}`).then(data => {
            callback(data)
        })
    },
    // 根据id删除商品
    deleteLgoods(params, callback) {
        return instance.delete(`goods/${params}`).then(data => {
            callback(data)
        })
    },
    // 根据id删除角色
    deleteRoles(params, callback) {
        return instance.delete(`roles/${params}`).then(data => {
            callback(data)
        })
    },
    // 根据id删除商品
    deleteIdCate(params, callback) {
        return instance.delete(`categories/${params}`).then(data => {
            callback(data)
        })
    },
}

// 挂载axios拦截器
instance.interceptors.request.use(config => {
    nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
});
instance.interceptors.response.use(config => {
    nprogress.done()
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
