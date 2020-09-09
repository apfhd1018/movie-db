import React from "react";
import { Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};

const Register = ({ setRegister, setLogin }) => {
  const closeRegister = () => {
    setRegister(false);
  };
  return (
    <div className="login">
      <div className="login-box" style={{ position: "relative" }}>
        <h2>Create account</h2>
        <Form {...layout} name="basic">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "5px" }}
            >
              Submit
            </Button>
            <Button
              type="primary"
              onClick={closeRegister}
              style={{ marginLeft: "5px" }}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
        <ArrowLeftOutlined
          className="backToLogin"
          onClick={() => {
            setRegister(false);
            setLogin("block");
          }}
        />
      </div>
    </div>
  );
};

export default Register;
