-- Insert admin user with bcrypt hash for password 'admin123'
INSERT INTO "User" (id, email, password, name, role, "createdAt")
VALUES (
    'admin-uuid-001',
    'admin@torkcrm.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqOdfoq1gJvRz0TQTD7n7X7Kl8Xv6',
    'Admin Tork',
    'ADMIN',
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
