import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom'

import News from './component/page/News';
import SignUp from './component/page/SignUp';
import SignIn from "./component/page/SignIn";
import FindPassword from "./component/page/ForgetPassword";
import ResetPassword from "./component/page/ResetPassword";
import UpdatePassword from "./component/page/UpdatePassword";

const routes = (
    <HashRouter>
        <Switch>

            <Route path='/' exact component={SignIn}/>

            <Route path='/signup' component={SignUp}/>
            <Route path='/signin' component={SignIn}/>
            <Route path='/FindPassword' component={FindPassword}/>
            <Route path='/ResetPassword' component={ResetPassword}/>
            <Route path='/UpdatePassword' component={UpdatePassword}/>

            <Route path='/news' component={News}/>
        </Switch>
    </HashRouter>
);

export default routes;
