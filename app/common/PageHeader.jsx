import {Avatar, Button, message, Popover, Badge} from "antd";
import App from "./App";
import React from "react";

const PageHeader = (<div style={{textAlign: 'right'}}>


    <Popover content={<div>
        <Button style={{margin: 10}} type="primary" icon="search" onClick={() => {
            App.go(`/UpdatePassword`)
        }}>查看消息</Button>
        <br/>
        <Button style={{margin: 10}} type="primary" icon="edit" onClick={() => {
            App.go(`/SignIn`)
        }}>标为已读</Button>
    </div>} title="消息中心">
        <Badge count={100}>
            <i className='fa fa-bell-o fa-2x' style={{margintop: '3px'}}/>
        </Badge>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
    </Popover>

    <Popover content={<div>

        <Button style={{margin: 10}} type="primary" icon="edit" onClick={() => {
            let pasthourstime = 24;
            let now = new Date().getTime();
            let signInKey = App.signInKey();
            let time = pasthourstime * 60 * 60 * 1000;
            if (parseInt(signInKey) + time < parseInt(now)) {
                message.info("登录已失效，请重新登录！");
                setTimeout(() => {
                    App.go(`SignIn`)
                }, 3000);
            } else {
                App.go(`/UpdatePassword`)
            }
        }}>修改密码</Button>

        <br/>
        <Button style={{margin: 10}} type="primary" icon="poweroff" onClick={() => {
            App.go(`/SignIn`)
        }}>退出登录</Button>
    </div>} title="个人中心">
        <Avatar style={{backgroundColor: "#ff0000", verticalAlign: 'middle'}} size="large">
            {App.userProfile().nick}
        </Avatar>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
    </Popover>

</div>);

export default PageHeader;