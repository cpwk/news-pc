import React from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import App from '../../common/App.jsx';

class UpdatePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    componentDidMount() {
        this.genValCode();

    }

    UpdatePassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {

                let {key} = this.state;
                let {password, newpassword, renewpassword, code} = user;
                let {mobile} = App.userProfile();
                console.log(mobile);


                if (newpassword !== renewpassword) {
                    message.info('两次输入的密码不一致，请重新输入!');
                    return;
                }
                App.api('user/update_password', {
                    mobile,
                    password, newpassword, vCode: JSON.stringify({
                        key,
                        code
                    })
                }).then((result) => {
                    if (result == "success") {
                        message.success("修改密码成功！请重新登录");
                        setTimeout(() => {
                            App.go(`/SignIn`);
                        }, 1000);
                    }
                });
            }
        })
    };

    genValCode = () => {
        let key = new Date().getTime();
        this.setState({key: key});
        this.setState({
            img_src: App.API_BASE + '/support/vcode/vcode?key=' + key,
            valCode: {key, code: ''}
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        let {img_src} = this.state;

        return <div style={{width: '100vw', position: 'relative'}}>

            <Form className="login-form"

                  style={{

                      width: '280px',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-140px',
                      paddingTop: '250px'
                  }}>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请输入原密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('newpassword', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请输入新密码"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('renewpassword', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请确认新密码"
                        />,
                    )}
                </Form.Item>

                <Form.Item style={{float: 'left', width: '130px'}}>
                    {getFieldDecorator('code', {
                        rules: [{required: true, message: '验证码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="number" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入验证码"
                        />,
                    )}
                </Form.Item>

                <img src={img_src} style={{width: '80px', marginTop: '1px', marginLeft: '35px'}}
                     onClick={this.genValCode}/>

                <Form.Item>

                    <Button type="primary"
                            htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                this.UpdatePassword()
                            }}>
                        修改密码</Button>

                </Form.Item>

            </Form>
        </div>;
    }
}

export default Form.create()(UpdatePassword);