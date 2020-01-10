import React from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import App from '../../common/App.jsx';

class ForgetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    componentDidMount() {
        this.genValCode();
    }

    forgetPassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                })
            } else {
                let {mobile, code} = user;
                let {key} = this.state;
                let regex = /^1[34578]\d{9}$/;
                if (!regex.test(mobile)) {
                    message.info("请输入正确的手机号")
                } else {
                    App.api('user/forget_password', {
                        mobile, vCode: JSON.stringify({
                            key,
                            code
                        })
                    }).then((result) => {
                        if (result == mobile) {
                            message.success('验证成功! 请重置密码');
                            App.saveCookie("user-profile", mobile);
                            setTimeout(() => {
                                App.go(`/ResetPassword`);
                            }, 1000)
                        }
                    })
                }
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

            <Form className="login-form"

                  style={{

                      width: '280px',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-140px',
                      paddingTop: '250px'
                  }}>

                <Form.Item>
                    {getFieldDecorator('mobile', {
                        rules: [{required: true, message: '手机号不能为空!'}],
                    })(
                        <Input
                            prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="请输入手机号"
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
                                this.forgetPassword()
                            }}>
                        验证信息</Button>

                </Form.Item>

            </Form>
        </div>;
    }
}

export default Form.create()(ForgetPassword);