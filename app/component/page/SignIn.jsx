import React from 'react';
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
import App from '../../common/App.jsx';

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    componentDidMount() {
        this.genValCode();
    }

    check = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                let {unknown, password, code} = user;
                let {key} = this.state;
                App.api('user/sign_in', {
                    unknown,
                    password,
                    vCode: JSON.stringify({
                        key,
                        code
                    }),
                }).then((result) => {
                    if (result != "undefined") {
                        let {user = {}, userSession = {}} = result;
                        App.saveCookie("user-token", userSession.token);
                        App.saveCookie("user-profile", JSON.stringify(user));
                        App.saveCookie("signin-key", key);
                        message.loading('登录成功!正在初始化系统...', 1, null);
                        setTimeout(() => {
                            App.go(`/News`);
                        }, 800)
                    }
                })
            }
        });
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

            <Form className="login-form" style={{
                width: '280px',
                position: 'absolute',
                left: '50%',
                marginLeft: '-140px',
                paddingTop: '250px'
            }}>

                <Form.Item>
                    {getFieldDecorator('unknown', {
                        rules: [{required: true, message: '此列不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入手机号/邮箱/昵称"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请输入密码"
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

                <Form.Item style={{clear: 'both'}}>

                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>记住密码</Checkbox>)}

                    <a className="login-form-forgot" style={{float: 'right'}} onClick={() => {
                        App.go(`/FindPassword`);
                    }}>
                        忘记密码
                    </a>

                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                this.check()
                            }}>
                        登录</Button>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                App.go(`/SignUp`)
                            }}>
                        没有账号？点击注册</Button>
                </Form.Item>

            </Form>
        </div>;
    }
}

export default Form.create()(SignIn);