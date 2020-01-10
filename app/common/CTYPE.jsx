let CTYPE = (() => {

    return {


        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        pagination: {pageSize: 10},

        link: {
            news: {key: '/news', path: '/news', txt: '新闻管理'},
        }
    }

})();

export default CTYPE;