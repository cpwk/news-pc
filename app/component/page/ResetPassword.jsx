import React from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import App from '../../common/App.jsx';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeChange: "",
            time: 60,
            btnDisable: false,
            btnContent: '获取验证码',
            user: {},
            key: ""
        }
    }

    componentDidMount() {

    }

    check = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                this.sendCode();
                this.getVcode()
            }
        })
    };

    sendCode = () => {
        this.setState({
            btnDisable: true,
            btnContent: "60s之后重新获取",
            timeChange: setInterval(this.clock, 1000),
        });
    };

    clock = () => {

        let {timeChange} = this.state;
        let {time} = this.state;

        if (time > 0) {
            time = time - 1;
            this.setState({
                time: time,
                btnContent: time + "s之后重新获取",
            });
        } else {
            clearInterval(timeChange);
            this.setState({
                btnDisable: false,
                time: 60,
                btnContent: "获取验证码",
            });
        }
    };

    getVcode = () => {
        this.props.form.validateFields((err) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                let mobile = App.userProfile();
                let key = new Date().getMilliseconds();
                this.setState({key: key});
                App.api('/support/sms/phone_vcode', {key, mobile}).then((result) => {
                    if (result == "success") {
                        message.success("验证码发送成功，请注意查收")
                    }
                });
            }
        })
    };

    resetPassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {

                let {key} = this.state;
                let mobile = App.userProfile();
                let {password, repassword, smsCode} = user;

                if (password !== repassword) {
                    message.info('两次输入的密码不一致，请重新输入!');
                    return;
                }
                App.api('user/reset_password', {mobile, password, key, smsCode}).then((result) => {
                    if (result == "success") {
                        message.success("重置密码成功！请登录");
                        setTimeout(() => {
                            App.go(`/SignIn`);
                        }, 1000);
                    }
                });
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

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
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('repassword', {
                        rules: [{required: true, message: '密码不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="请确认密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item style={{float: 'left', width: '130px'}}>
                    {getFieldDecorator('smsCode', {})(
                        <Input
                            prefix={<Icon type="number" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入验证码"
                        />,
                    )}

                </Form.Item>

                <Button type="primary"
                        disabled={this.state.btnDisable} className="login-form-button"
                        style={{width: '140px', marginTop: '5px', marginLeft: '5px'}} onClick={() => {
                    this.check();
                }}>{this.state.btnContent}</Button>
                <Form.Item>

                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                this.resetPassword()
                            }}>
                        重置密码</Button>
                </Form.Item>

            </Form>
        </div>;
    }
}

export default Form.create()(ResetPassword);