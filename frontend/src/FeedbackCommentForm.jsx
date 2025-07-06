import React, { useState } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";

const FeedbackCommentForm = ({ postId, onSubmitSuccess }) => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      message.error("Nội dung không được để trống");
      return;
    }
    try {
      await axios.post("/api/feedback-comments", {
        postId,
        name,
        content,
      });
      message.success("Góp ý đã gửi, chờ kiểm duyệt!");
      setContent("");
      setName("");
      if (onSubmitSuccess) onSubmitSuccess();
    } catch {
      message.error("Có lỗi khi gửi góp ý!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <Input
        placeholder="Tên của bạn (có thể để trống)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Input.TextArea
        placeholder="Nội dung góp ý"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
        style={{ marginBottom: 8 }}
      />
      <Button type="primary" htmlType="submit">Gửi góp ý</Button>
    </form>
  );
};

export default FeedbackCommentForm;