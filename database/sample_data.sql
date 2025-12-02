-- =============================================
-- SAMPLE DATA FOR TESTING
-- Run after schema.sql
-- =============================================

-- Insert sample project
INSERT INTO projects (id, name, description, pbx_ip, pbx_port, api_username, is_active)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'GLS Klicni Center',
    'Demo klicni center za testiranje',
    '10.102.6.10',
    8088,
    'api',
    true
);

-- Insert sample agents
INSERT INTO agents (project_id, extension, name, department, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '304', 'Vesna Jungic', 'Podpora', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '306', 'Marko Novak', 'Prodaja', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '309', 'Anja Repnik', 'Podpora', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '320', 'Peter Horvat', 'Prodaja', true);

-- Insert sample CDR records (November 25, 2025)
INSERT INTO cdr_records (project_id, call_id, time_start, extension, caller_number, callee_number, call_duration, talk_duration, call_status, call_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-001', '2025-11-25 08:15:00+00', '304', '041234567', '304', 120, 95, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-002', '2025-11-25 08:32:00+00', '306', '306', '070123456', 180, 165, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-003', '2025-11-25 09:10:00+00', '309', '051987654', '309', 45, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-004', '2025-11-25 09:45:00+00', '304', '304', '309', 60, 52, 'ANSWERED', 'Internal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-005', '2025-11-25 10:20:00+00', '320', '320', '031555666', 90, 78, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-006', '2025-11-25 10:55:00+00', '306', '040111222', '306', 200, 185, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-007', '2025-11-25 11:30:00+00', '309', '309', '070999888', 150, 138, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-008', '2025-11-25 12:05:00+00', '304', '051444333', '304', 30, 0, 'BUSY', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-009', '2025-11-25 13:15:00+00', '320', '041777888', '320', 240, 225, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-010', '2025-11-25 14:00:00+00', '306', '306', '040222333', 110, 98, 'ANSWERED', 'Outbound');

-- Insert sample CDR records (November 26, 2025)
INSERT INTO cdr_records (project_id, call_id, time_start, extension, caller_number, callee_number, call_duration, talk_duration, call_status, call_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-011', '2025-11-26 08:05:00+00', '309', '070555444', '309', 85, 72, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-012', '2025-11-26 08:40:00+00', '304', '304', '051333222', 195, 180, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-013', '2025-11-26 09:20:00+00', '320', '040666777', '320', 55, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-014', '2025-11-26 10:00:00+00', '306', '306', '304', 45, 38, 'ANSWERED', 'Internal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-015', '2025-11-26 10:35:00+00', '309', '309', '070111000', 220, 205, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-016', '2025-11-26 11:15:00+00', '304', '041888999', '304', 160, 148, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-017', '2025-11-26 12:00:00+00', '320', '320', '051666555', 95, 82, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-018', '2025-11-26 13:30:00+00', '306', '070333222', '306', 40, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-019', '2025-11-26 14:15:00+00', '309', '040999000', '309', 280, 265, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-020', '2025-11-26 15:00:00+00', '304', '304', '070444555', 130, 118, 'ANSWERED', 'Outbound');

-- Insert sample CDR records (November 27, 2025)
INSERT INTO cdr_records (project_id, call_id, time_start, extension, caller_number, callee_number, call_duration, talk_duration, call_status, call_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-021', '2025-11-27 08:30:00+00', '306', '051222111', '306', 175, 160, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-022', '2025-11-27 09:15:00+00', '320', '320', '040888777', 105, 92, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-023', '2025-11-27 10:00:00+00', '304', '070666555', '304', 65, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-024', '2025-11-27 10:45:00+00', '309', '309', '306', 35, 28, 'ANSWERED', 'Internal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-025', '2025-11-27 11:30:00+00', '306', '306', '051777666', 245, 230, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-026', '2025-11-27 12:15:00+00', '320', '041333444', '320', 140, 125, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-027', '2025-11-27 13:00:00+00', '304', '304', '070222111', 80, 68, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-028', '2025-11-27 14:00:00+00', '309', '040555666', '309', 25, 0, 'BUSY', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-029', '2025-11-27 14:45:00+00', '306', '051999888', '306', 190, 175, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-030', '2025-11-27 15:30:00+00', '320', '320', '041666777', 155, 142, 'ANSWERED', 'Outbound');

-- Insert sample CDR records (December 1, 2025)
INSERT INTO cdr_records (project_id, call_id, time_start, extension, caller_number, callee_number, call_duration, talk_duration, call_status, call_type) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-031', '2025-12-01 08:00:00+00', '304', '070123789', '304', 95, 82, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-032', '2025-12-01 08:45:00+00', '309', '309', '051456123', 210, 195, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-033', '2025-12-01 09:30:00+00', '306', '041789456', '306', 50, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-034', '2025-12-01 10:15:00+00', '320', '320', '309', 40, 32, 'ANSWERED', 'Internal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-035', '2025-12-01 11:00:00+00', '304', '304', '070321654', 165, 150, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-036', '2025-12-01 11:45:00+00', '309', '040654987', '309', 125, 110, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-037', '2025-12-01 12:30:00+00', '306', '306', '051987321', 185, 170, 'ANSWERED', 'Outbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-038', '2025-12-01 13:15:00+00', '320', '070852963', '320', 35, 0, 'NO ANSWER', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-039', '2025-12-01 14:00:00+00', '304', '041963852', '304', 230, 215, 'ANSWERED', 'Inbound'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'call-040', '2025-12-01 15:00:00+00', '309', '309', '070741852', 145, 130, 'ANSWERED', 'Outbound');
