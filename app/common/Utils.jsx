import React from 'react';
import ReactDOM from 'react-dom';
import {LocaleProvider} from 'antd';
import {CTYPE} from "./index";
import zhCN from 'antd/lib/locale-provider/zh_CN';

let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let {id} = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            } else {

            }

            document.body.appendChild(div);
            ReactDOM.render(<LocaleProvider locale={zhCN}>{child}</LocaleProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        return {
            renderReactDOM, closeModalContainer, createModalContainer
        }
    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let {pageable} = result;
            let {totalElements} = result;
            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.offset / pageable.pageSize + 1;
            let totalPages = Math.ceil(totalElements / pageable.pageSize);
            return {
                current,
                total: totalElements, totalPages,
                pageSize
            }
        };

        return {convert2Pagination}

    })();

    return {
        common, pager
    };

})();

export default Utils;
