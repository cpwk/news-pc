import React from 'react';
import {
    Card,
    Col,
    Icon,
    Input,
    Menu,
    Row,
    Select,
    Table,
    Layout,
} from 'antd';

import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import {PageHeader} from "../../common/Element"
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Link} from "react-router-dom";

const InputSearch = Input.Search;
const Option = Select.Option;
const {Header, Footer, Sider, Content} = Layout;

export default class News extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            selectedRowKeys: [],
            openKeys: ['sub1'],
            key: 'title',
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
            collapsed: false,
        }
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    componentDidMount() {
        this.loadData();
    }

    getQuery = () => {
        let {search, q, key, status} = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'title') {
                    query = {title: q};
                }
            }
        }
        if (status !== 0) {
            query.status = status;
        }
        return query;
    };

    loadData = () => {

        let {pagination = {}} = this.state;

        App.api('news/findall', {

            newsQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })

        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    doExport = () => {
        Utils.exportExcel.doExport('trainees', this.getQuery());
    };

    render() {

        let {list = [], pagination = {}, q} = this.state;

        return <div>

            <Layout style={{minHeight: '100vh'}}>

                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo"/>

                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" openKeys={this.state.openKeys}
                          onOpenChange={this.onOpenChange}>
                        <Menu.Item key="11">
                            <Icon type="home"/>
                            <span>新闻首页</span>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <Icon type="setting"/>
                            <span>系统设置</span>
                        </Menu.Item>
                    </Menu>

                </Sider>

                <Layout>

                    <Header style={{background: '#fff', padding: 0}}>
                        {PageHeader}
                    </Header>

                    <Content style={{margin: '0 16px'}}>

                        <BreadcrumbCustom first={<Link to={CTYPE.link.news.path}>{CTYPE.link.news.txt}</Link>}/>

                        <Card>

                            <Row>


                                <Col span={8} style={{float: 'right'}}>

                                    <Select onSelect={(status) => {
                                        this.setState({status, search: true}, () => {
                                            this.loadData()
                                        });
                                    }} defaultValue={0} style={{width: 100}}>
                                        <Option value={0}>全部状态</Option>
                                        <Option value={1}>已发布</Option>
                                        <Option value={2}>未发布</Option>
                                    </Select>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <InputSearch
                                        placeholder="输入内容查询"
                                        style={{width: 200}}
                                        value={q}
                                        onChange={(e) => {
                                            this.setState({q: e.target.value});
                                        }}
                                        onSearch={(v) => {
                                            this.setState({
                                                q: v, search: true, pagination: {
                                                    ...pagination,
                                                    current: 1
                                                }
                                            }, () => {
                                                this.loadData()
                                            });
                                        }}/>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;


                                </Col>
                            </Row>

                            <Table


                                columns={[

                                    {
                                        title: '序号',
                                        dataIndex: 'id',
                                        className: 'txt-center',
                                        render: (col, row, i) => {
                                            return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                                        },
                                    },

                                    {
                                        title: '标题',
                                        dataIndex: 'title',
                                        className: 'txt-center'
                                    },

                                    {
                                        title: '点击量',
                                        dataIndex: 'clickNum',
                                        className: 'txt-center'
                                    },

                                    {
                                        title: '创建日期',
                                        dataIndex: 'createdAt',
                                        className: 'txt-center',
                                        render: (createdAt) => {
                                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                                        }
                                    },

                                    {
                                        title: '状态',
                                        dataIndex: 'status',
                                        className: 'txt-center',
                                        render: (status) => {
                                            return <div className="state">
                                                {status === 1 ? <span>已发布</span> :
                                                    <span className="warning">未发布</span>}</div>
                                        }
                                    },
                                ]}

                                rowKey={(item) => item.id}

                                dataSource={list}

                                pagination={{...pagination, ...CTYPE.commonPagination}}

                                onChange={this.handleTableChange}/>

                        </Card>

                    </Content>

                    <Footer style={{textAlign: 'center'}}>迈道教育 @2019 Created by 陈鹏</Footer>
                </Layout>
            </Layout>

        </div>
    }
}