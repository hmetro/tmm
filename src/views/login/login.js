import Auth from '../../models/auth';
import FormLogin from './formlogin';
import App from '../app';
import Offline from '../offline';

const Login = {
    oninit: () => {
        if (Auth.isLogin()) {
            return m.route.set('/inicio');
        }
    },
    oncreate: () => {
        document.title = "Entrar | " + App.title;
        submitLogin();
    },

    view: () => {
        return [
            m(FormLogin),
            m(Offline),
        ];
    },
};

function submitLogin() {
    document.onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == "13") {
            if (Auth.canSubmit()) {
                $('button').click();
            }
        }
    };
}

export default Login;