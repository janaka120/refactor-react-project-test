import React, { useState } from "react";
import { Button, Typography, Switch } from "antd";
import { CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";

interface UserProfileProps {
  onLogout: () => void;
  onThemeToggle?: () => void;
  theme?: "dark" | "light";
}

interface UserPopoverProps {
  userInfo: { name: string; email: string };
  onLogout: () => void;
  onCancel: () => void;
  onThemeToggle?: () => void;
  theme?: "dark" | "light";
}

const UserProfile: React.FC<UserProfileProps> = ({
  onLogout,
  onThemeToggle,
  theme,
}) => {
  const [visible, setVisible] = useState(false);

  const userInfo = {
    name: "User",
    email: "user@email.com",
  };

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const UserPopover: React.FC<UserPopoverProps> = ({
    userInfo,
    onLogout,
    onCancel,
    onThemeToggle,
    theme,
  }) => (
    <div
      style={{
        minWidth: 280,
        padding: 28,
        background: "var(--panel-background-color)",
        borderRadius: 14,
        boxShadow: "0 4px 32px var(--panel-shadow-color)",
        textAlign: "center",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        position: "relative",
      }}
    >
      <Typography.Text
        strong
        style={{ fontSize: 18, color: "var(--text-color)" }}
      >
        {userInfo.name}
      </Typography.Text>
      <br />
      <Typography.Text
        type="secondary"
        style={{ fontSize: 14, color: "var(--text-color)" }}
      >
        {userInfo.email}
      </Typography.Text>
      <div
        style={{
          margin: "20px 0 16px 0",
          borderTop: "1px solid var(--border-color)",
        }}
      />
      <div
        style={{ marginBottom: 16, fontSize: 15, color: "var(--text-color)" }}
      >
        Do you want to log out?
      </div>
      <Button
        type="primary"
        block
        style={{
          background: "#e74c3c",
          borderColor: "#e74c3c",
          color: "#fff",
          fontWeight: 500,
          borderRadius: 8,
        }}
        onClick={() => {
          onCancel();
          onLogout();
        }}
      >
        Log out
      </Button>
      <Button
        block
        style={{
          marginTop: 10,
          background: "transparent",
          border: "1px solid var(--border-color)",
          color: "var(--text-color)",
          borderRadius: 8,
        }}
        onClick={onCancel}
      >
        Cancel
      </Button>
      {onThemeToggle && (
        <div
          style={{
            marginLeft: 8,
            marginTop: 16,
            display: "inline-block",
          }}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={theme === "dark"}
            onChange={onThemeToggle}
          />
          <span
            style={{ marginLeft: 8, color: "var(--text-color)", fontSize: 14 }}
          >
            {theme === "dark" ? "Light" : "Dark"} Theme
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="top-bar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ marginLeft: "auto" }}>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={handleOpen}
          style={{
            background: "var(--panel-background-color)",
            border: "1px solid var(--border-color)",
            color: "var(--text-color)",
          }}
        />
      </div>
      {visible && (
        <div
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(23, 25, 34, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onClick={handleClose}
        >
          <div
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <UserPopover
              userInfo={userInfo}
              onLogout={onLogout}
              onCancel={handleClose}
              onThemeToggle={onThemeToggle}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
