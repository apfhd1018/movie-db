import React from "react";
import { Form, Input, Button, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};

const Login = ({ login, setLogin, openRegister, setChange }) => {
  // 닫기창 누르면 로그인창 닫힘
  const closeLogin = () => {
    setLogin("none");
  };
  // 로그인 요청
  const onLogin = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );

      const accessToken = sessionStorage.setItem(
        "accessToken",
        res.data.accessToken
      );
      const refreshToken = sessionStorage.setItem(
        "refreshToken",
        res.data.refreshToken
      );
      console.log("요청성공", res.data);
      console.log("엑세스토큰", accessToken);
      console.log("리프레시토큰", refreshToken);

      alert("Login successed!");
      setLogin(false);
      setChange(false);
    } catch (err) {
      alert("Login failed");
      console.log(err);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h2>Enjoy Our Movie Database!</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onLogin}
          {...layout}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
            style={{ marginBottom: "30px" }}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "5px" }}
            >
              Log in
            </Button>
            <Button
              type="primary"
              onClick={closeLogin}
              style={{ marginLeft: "5px" }}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ color: "#767676" }}>New to MovieDB?</Divider>
        <Button style={{ width: "80%" }} onClick={openRegister}>
          Create your MovieDB account
        </Button>
      </div>
    </div>
  );
};

export default Login;
