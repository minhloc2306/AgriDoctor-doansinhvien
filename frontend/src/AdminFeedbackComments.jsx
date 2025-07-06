import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm, message } from 'antd';
import axios from 'axios';

const AdminFeedbackComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy token admin từ localStorage hoặc context
  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/feedback-comments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      message.error('Không lấy được danh sách góp ý.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/feedback-comments/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Duyệt thành công!');
      fetchComments();
    } catch {
      message.error('Có lỗi khi duyệt góp ý.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feedback-comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã xóa góp ý.');
      fetchComments();
    } catch {
      message.error('Có lỗi khi xóa góp ý.');
    }
  };

  const columns = [
    {
      title: 'Bài viết',
      dataIndex: ['post', 'title'],
      key: 'post',
      render: (title, record) => title || record.post
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name) => name || 'Ẩn danh'
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Trạng thái',
      dataIndex: 'approved',
      key: 'approved',
      render: (approved) =>
        approved ? <Tag color="green">Đã duyệt</Tag> : <Tag color="orange">Chờ duyệt</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          {!record.approved && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleApprove(record._id)}
              style={{ marginRight: 8 }}
            >Duyệt</Button>
          )}
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản trị góp ý/bình luận</h2>
      <Table
        columns={columns}
        dataSource={comments}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminFeedbackComments;