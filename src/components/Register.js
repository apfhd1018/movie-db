import React from "react";
import { Form, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};

const Register = ({ setRegister, setLogin }) => {
  const closeRegister = () => {
    setRegister(false);
  };

  // onSubmit 이벤트에서 async await => try, catch하지 않을경우 에러발생시 화면나감
  const onSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/users/add", values);
      alert("You have successfully registered as a member. Please log in.");
      setRegister(false);
      setLogin(true);
    } catch (error) {
      alert(
        "Is your ID or password more than 3 characters long?\nOr your ID already exists."
      );
    }
  };

  return (
    <div className="login">
      <div className="login-box" style={{ position: "relative" }}>
        <h2>Create account</h2>
        <Form {...layout} name="basic" onFinish={onSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!(At least 3 string.)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!(At least 3 string.)",
              },
            ]}
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
            setLogin(true);
          }}
        />
      </div>
    </div>
  );
};

export default Register;
