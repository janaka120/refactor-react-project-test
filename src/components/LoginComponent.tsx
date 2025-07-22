import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert, Card } from "antd";

type LoginComponentProps = {
  onLoginSuccess?: () => void;
};

const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFinish = async (values) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(); // Call the success callback, passing the token
      } else {
        setErrorMsg(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login API call failed:", error);
      setErrorMsg("Network error. Could not connect to the server.");
    } finally {
      setLoading(false); // Always set loading to false after the attempt
    }
  };

  return (
    <div
      id="login-component"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background-color)",
      }}
    >
      <Card
        style={{
          minWidth: 340,
          boxShadow: "0 2px 16px var(--panel-shadow-color)",
          background: "var(--background-color)",
          border: "1px solid var(--border-color)",
        }}
        styles={{
          body: { padding: 32 },
        }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 24,
            color: "var(--text-color)",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: "0 1px 2px #0006",
          }}
        >
          Login
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleFinish}
        >
          <Form.Item
            label={
              <span style={{ color: "var(--text-color)", fontWeight: 500 }}>
                Username
              </span>
            }
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              name="username"
              autoComplete="username"
              autoFocus
              style={{
                background: "var(--background-color)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
              }}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: "var(--text-color)", fontWeight: 500 }}>
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              style={{
                background: "var(--background-color)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
              }}
              placeholder="Enter your password"
              name="password"
              autoComplete="current-password"
            />
          </Form.Item>

          {errorMsg && (
            <Form.Item>
              <Alert message={errorMsg} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                fontWeight: 600,
                letterSpacing: 1,
                background:
                  "linear-gradient(90deg, var(--gradient-start) 0%, var(--border-color) 100%)",
                border: "none",
                color: "var(--text-color)",
                boxShadow: "0 2px 8px #0002",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginComponent;
